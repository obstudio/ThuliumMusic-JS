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
    const length = secs.length
    let pointer = 0
    let repeatBeginIndex = 0
    let order = 1
    let skip = false
    while (pointer < length) {
      const element = secs[pointer]
      switch (element.Type) {
      case 'RepeatEnd':
        if (order === 1) {
          pointer = repeatBeginIndex + 1
          order += 1
          continue
        } else {
          let pointer1 = repeatBeginIndex + 1
          let flag = false
          while (pointer1 < length) {
            if (secs[pointer1].Type === 'RepeatBegin') break
            if (secs[pointer1].Type === 'Volta' && secs[pointer1].Order.indexOf(order + 1) !== -1) {
              flag = true
              break
            }
            pointer1 += 1
          }
          if (flag) {
            pointer = repeatBeginIndex + 1
            order += 1
            continue
          } else {
            pointer += 1
          }
        }
        break
      case 'RepeatBegin':
        repeatBeginIndex = pointer
        pointer += 1
        order = 1
        break
      case 'Volta':
        if (element.Order.indexOf(order) === -1) {
          skip = true
          pointer += 1
        } else {
          skip = false
          // element.Order.splice(element.Order.indexOf(order), 1)
          // skip = (element.Order.length === 0)
          // this.order.push(pointer)
          pointer += 1
        }
        break
      case 'Section':
      case 'FUNCTION':
        if (!skip) this.order.push(pointer)
        pointer += 1
        break
      default:
        pointer += 1
      }

      // if (element.Type === 'RepeatEnd') {
      //   if (skip) element.Type = ''
      //   if (order === 1) {
      //     pointer = repeatBeginIndex
      //     order += 1
      //     continue
      //   } else {
      //     let pointer1 = repeatBeginIndex
      //     let flag = false
      //     while (pointer1 < length) {
      //       if (secs[pointer1].Type === 'RepeatBegin') break
      //       if (secs[pointer1].Type === 'Volta' && secs[pointer1].Order.indexOf(order + 1) !== -1) {
      //         flag = true
      //         break
      //       }
      //       pointer1 += 1
      //     }
      //     if (flag) {
      //       pointer = repeatBeginIndex
      //       order += 1
      //       continue
      //     } else {
      //       // this.order.push(pointer)
      //       pointer += 1
      //     }
      //   }
      // } else if (element.Type === 'RepeatBegin') {
      //   repeatBeginIndex = pointer
      //   element.Type = ''
      //   pointer += 1
      //   order = 1
      // } else if (element.Type === 'Volta') {
      //   if (element.Order.indexOf(order) === -1) {
      //     pointer += 1
      //   } else {
      //     element.Order.splice(element.Order.indexOf(order), 1)
      //     skip = (element.Order.length === 0)
      //     // this.order.push(pointer)
      //     pointer += 1
      //   }
      // } else {
      //   if (element.Type !== '') this.order.push(pointer)
      //   pointer += 1
      // }
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
