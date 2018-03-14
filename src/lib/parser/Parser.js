import Loader from './LibLoader'
import GlobalSetting from './GlobalSetting'
import { TrackParser } from './TrackParser'
import TmError from './Error'
const EPSILON = 0.0000000001

export default class Parser {
  /**
   * Tm Parser
   * @param {Tm.TokenizedData} tokenizedData 经过tok的JSON对象
   * @example
   * new Parser(tokenizedData)
   */
  constructor(tokenizedData) {
    this.tokenizedData = tokenizedData
    this.libraries = new Loader(this.tokenizedData.Library).load()
    this.result = {
      Sections: undefined
    }
    this.sectionContext = {
      Settings: new GlobalSetting(),
      PrevFin: undefined
    }
    this.order = []
  }

  parse() {
    const result = []
    this.generateOrder()
    this.order.forEach((index) => {
      const part = this.tokenizedData.Sections[index]
      if (part.Type === 'Section') {
        result.push(this.parseSection())
      } else {
        this.libraries.FunctionPackage.applyFunction({ Settings: this.sectionContext.Settings, Context: {} }, part)
      }
    })
    return result
  }

  generateOrder() {
    const secs = this.tokenizedData.Sections
    this.tokenizedData.Sections = []
    const length = secs.length
    let pointer = 0
    let repeatBeginIndex = []
    let segnoIndex = null
    let codaIndex = null
    let order = []
    let volta = []
    let isCoda = false
    let skip = false
    while (pointer < length) {
      const element = secs[pointer]
      switch (element.Type) {
      case 'RepeatBegin':
        repeatBeginIndex.push(pointer)
        order.push(1)
        break
      case 'RepeatEnd':
        if (order.length == 0) {
          repeatBeginIndex.push(-1)
          order.push(1)
        }
        if (volta.length > 0) {
          if (volta.indexOf(order + 1) == -1 && (secs[pointer + 1].Type != "Volta" || secs[pointer + 1].Volta.indexOf(order + 1) == -1)) {
            repeatBeginIndex.pop()
            order.pop()
          } else {
            order[-1]++
            index = repeatBeginIndex[-1]
            volta = []
          }
        } else {
          if (order[-1] == 1) {
            order[-1]++
            index = repeatBeginIndex[-1]
          } else {
            repeatBeginIndex.pop()
            order.pop()
          }
        }
        break
      case 'Volta':
        if (element.Volta.indexOf(order) == -1) {
          // 跳到下一个 Volta 的位置
        } else {
          volta = element.Volta
        }
        break
      case 'Segno':
        if (segnoIndex == null) {
          segnoIndex = pointer
        } else {
          // 报个错
        }
        break
      case 'Coda':
        if (skip) {
          if (codaIndex == null) {
            // 报个错
          } else {
            pointer = codaIndex
          }
        } else {
          if (isCoda) {
            codaIndex = pointer
          } else {
            isCoda = true
          }
        }
        break
      case 'DaCapo':
        if (!skip) {
          skip = true
          pointer = -1
        }
        break
      case 'DaSegno':
        if (!skip) {
          if (segnoIndex == null) {
            // 报个错
          } else {
            skip = true
            pointer = segnoIndex
          }
        }
        break
      case 'Section':
      case 'FUNCTION':
        this.tokenizedData.Sections.push(element)
        break
      }
      pointer += 1
    }
  }

  /**
   * parse section
   * @param {Tm.Section} section
   */
  parseSection(section) {
    const settings = this.sectionContext.Settings.extend()
    section.Settings.filter((token) => token.Type === 'FUNCTION')
      .forEach((token) => this.libraries.FunctionPackage.applyFunction({ settings, Context: {} }, token))
    const instrStatistic = {}
    const sec = {
      ID: section.ID,
      Tracks: [].concat(...section.Tracks.map((track) => {
        const tempTracks = new TrackParser(track, settings, this.libraries).parseTrack()
        for (const tempTrack of tempTracks) {
          if (tempTrack.Instrument in instrStatistic) {
            instrStatistic[tempTrack.Instrument] += 1
          } else {
            instrStatistic[tempTrack.Instrument] = 1
          }
          if (track.ID === '') {
            tempTrack.ID += '#' + instrStatistic[tempTrack.Instrument].toString()
          }
        }
        return tempTracks
      })),
      Warnings: []
    }
    const max = Math.max(...sec.Tracks.map((track) => track.Meta.Duration))
    if (!sec.Tracks.every((track) => Math.abs(track.Meta.Duration - max) < EPSILON)) {
      sec.Warnings.push(new TmError(TmError.Types.Section.DiffDuration, [], {Expected: sec.Tracks.map(() => max), Actual: sec.Tracks.map((l) => l.Meta.Duration)}))
    }
    const maxBarIni = Math.max(...sec.Tracks.map((track) => track.Meta.Incomplete[0]))
    const maxBarFin = Math.max(...sec.Tracks.map((track) => track.Meta.Incomplete[1]))
    const ini = sec.Tracks.every((track) => track.Meta.Incomplete[0] === maxBarIni)
    const fin = sec.Tracks.every((track) => track.Meta.Incomplete[1] === maxBarFin)
    if (!ini) {
      sec.Warnings.push(new TmError(TmError.Types.Section.InitiativeBar, [], {Expected: maxBarIni, Actual: sec.Tracks.map((l) => l.Meta.Incomplete[0])}))
    }
    if (!fin) {
      sec.Warnings.push(new TmError(TmError.Types.Section.FinalBar, [], {Expected: maxBarFin, Actual: sec.Tracks.map((l) => l.Meta.Incomplete[1])}))
    }
    if (fin && this.sectionContext.PrevFin === undefined) {
      this.sectionContext.PrevFin = maxBarFin
    } else if (fin && ini && this.sectionContext.PrevFin + maxBarIni !== settings.Bar) {
      const expected = settings.Bar - this.sectionContext.PrevFin
      sec.Warnings.push(new TmError(TmError.Types.Section.Mismatch, [], {Expected: expected, Actual: sec.Tracks.map((l) => l.Meta.Incomplete[0])}))
      this.sectionContext.PrevFin = maxBarFin
    }
    return sec
  }
}
