const sDef = [
  {
    pat: [
      {
        Type: 'Sfunc',
        Content: [
          /^(\d+)-/
        ]
      },
      {
        Type: 'Subtrack'
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Tremolo1',
        Simplified: true,
        Argument: [
          {
            Type: 'Expression',
            Content: match[0].Content[0].Content.slice(0, -1)
          },
          match[1]
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Subtrack'
      },
      {
        Type: 'Sfunc',
        Content: [
          /^(\d+)=/
        ]
      },
      {
        Type: 'Subtrack'
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Tremolo2',
        Simplified: true,
        Argument: [
          {
            Type: 'Expression',
            Content: match[1].Content[0].Content.slice(0, -1)
          },
          match[0],
          match[2]
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Subtrack'
      },
      {
        Type: 'Undef',
        Content: '~'
      },
      {
        Type: 'Subtrack'
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Portamento',
        Simplified: true,
        Argument: [
          match[0],
          match[2]
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Undef',
        Content: '$'
      },
      {
        Type: 'Note'
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Arpeggio',
        Simplified: true,
        Argument: [
          {
            Type: 'Subtrack',
            Repeat: -1,
            Content: [match[1]]
          }
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Sfunc',
        Content: [
          /^\./
        ]
      },
      {
        Type: ['Note', 'FUNCTION']
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Fermata',
        Simplified: true,
        Argument: [
          {
            Type: 'Subtrack',
            Repeat: -1,
            Content: [match[1]]
          }
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Sfunc',
        Content: [
          /(\d+)~/
        ]
      },
      {
        Type: 'Subtrack'
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Tuplet',
        Simplified: true,
        Argument: [
          {
            Type: 'Expression',
            Content: match[0].Content[0].Content.slice(0, -1)
          },
          match[1]
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Sfunc',
        Content: [
          /^(([0-7x%])([',#b]*)([A-Zac-wyz]*)([',#b]*)([-_.=]*)(`*)([:>]*)|\[(([0-7x%][',#A-Za-wyz:>]*)+)\]([',#b]*)([-_.=]*)(`*)([:>]*))+\^/
        ]
      },
      {
        Type: 'Note'
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'GraceNote',
        Simplified: true,
        Argument: [
          {
            Type: 'Subtrack',
            Content: Tokenizer.tokenizeTrack(match[0].Content[0].Content.slice(0, -1)),
            Repeat: -1
          },
          {
            Type: 'Subtrack',
            Content: [match[1]],
            Repeat: -1
          }
        ]
      }
    }
  },
  {
    pat: [
      {
        Type: 'Note'
      },
      {
        Type: 'Sfunc',
        Content: [
          /^\^(([0-7x%])([',#b]*)([A-Zac-wyz]*)([',#b]*)([-_.=]*)(`*)([:>]*)|\[(([0-7x%][',#A-Za-wyz:>]*)+)\]([',#b]*)([-_.=]*)(`*)([:>]*))+/
        ]
      }
    ],
    transform(match) {
      return {
        Type: 'FUNCTION',
        Name: 'Appoggiatura',
        Simplified: true,
        Argument: [
          {
            Type: 'Subtrack',
            Content: [match[0]],
            Repeat: -1
          },
          {
            Type: 'Subtrack',
            Content: Tokenizer.tokenizeTrack(match[1].Content[0].Content.slice(1)),
            Repeat: -1
          }
        ]
      }
    }
  }
]

const langDef = {
  Dynamic: [
    {
      regex: /^{(\d+\*)?/,
      action: {
        token: 'subtrack',
        next: 'root',
        transform(subtrack, content) {
          let repeat
          if (subtrack[1] !== undefined) {
            repeat = subtrack[1].slice(0, -1)
          } else {
            const pos = content.filter((e) => e.Type === 'BarLine' && e.Order[0] > 0)
            if (pos.length > 0) {
              repeat = Math.max(...pos.map((e) => Math.max(...e.Order)))
            } else {
              repeat = -1
            }
          }
          return {
            Type: 'Subtrack',
            Repeat: repeat,
            Content: content
          }
        }
      }
    },
    {
      regex: /^\)/,
      action: {
        token: '@pass',
        next: '@pop'
      }
    },
    {
      regex: /^[^{)]+/,
      action: {
        token: 'dyn',
        transform(match) {
          return {
            Type: 'Dyn',
            Content: match[0]
          }
        }
      }
    }
  ],
  root: [
    {
      regex: /^([0-7x%])([',#b]*)([A-Zac-wyz]*)([:>]*)([-_.=]*)(`*)/,
      action: {
        token: 'note',
        transform(note) {
          return {
            Type: 'Note',
            Pitches: [
              {
                Degree: note[1],
                PitOp: note[2] === undefined ? '' : note[2],
                Chord: note[3] === undefined ? '' : note[3],
                VolOp: note[4] === undefined ? '' : note[4]
              }
            ],
            PitOp: '',
            VolOp: '',
            DurOp: note[5] === undefined ? '' : note[5],
            Staccato: note[6] === undefined ? 0 : note[6].length
          }
        }
      }
    },
    {
      regex: /^\[(([0-7x%][',#A-Za-wyz:>]*)+)\]([',#b]*)([:>]*)([-_.=]*)(`*)/,
      action: {
        token: 'chord',
        transform(note) {
          return {
            Type: 'Note',
            Pitches: note[1].match(/[0-7x%][',#A-Za-wyz]*/g).map((pitch) => {
              const parts = pitch.match(/([0-7x%])([',#b]*)([ac-zA-Z]*)([:>]*)/)
              return {
                Degree: parts[1],
                PitOp: parts[2] === undefined ? '' : parts[2],
                Chord: parts[3] === undefined ? '' : parts[3],
                VolOp: parts[4] === undefined ? '' : parts[4]
              }
            }),
            PitOp: note[3] === undefined ? '' : note[3],
            DurOp: note[5] === undefined ? '' : note[5],
            VolOp: note[4] === undefined ? '' : note[4],
            Staccato: note[6] === undefined ? 0 : note[6].length
          }
        }
      }
    },
    {
      regex: /^(:\|\|:|:\|\||\|\|:|\||\\([\d,~\s])*:|\\|\/)/,
      action: {
        cases: {
          ':||:': {
            token: 'rEB'
          },
          ':||': {
            token: 'rE',
            transform() {
              return {
                Type: 'RepeatEnd'
              }
            }
          },
          '||:': {
            token: 'rB',
            transform() {
              return {
                Type: 'RepeatBegin'
              }
            }
          },
          '|': {
            token: 'ba',
            transform() {
              return {
                Type: 'BarLine',
                Skip: false,
                Order: [0],
                Overlay: false
              }
            }
          },
          '\\': {
            token: 'skip',
            transform() {
              return {
                Type: 'BarLine',
                Skip: true,
                Order: [0],
                Overlay: false
              }
            }
          },
          '/': {
            token: 'ol',
            transform() {
              return {
                Type: 'BarLine',
                Skip: false,
                Order: [0],
                Overlay: true
              }
            }
          },
          '@default': {
            token: 'pos',
            transform(pos) {
              let order = []
              if (pos[2] !== undefined) {
                const parts = pos[2].split(',')
                for (const part of parts) {
                  if (part.includes('~')) {
                    const [left, right] = part.split('~')
                    for (var i = left; i <= right; i++) {
                      order.push(i)
                    }
                  } else {
                    order.push(Number(part))
                  }
                }
              }
              return {
                Type: 'BarLine',
                Skip: false,
                Order: order,
                Overlay: false
              }
            }
          }
        }
      }
    },
    {
      regex: /^!/,
      action: {
        token: 'local',
        transform() {
          return {
            Type: 'LocalIndicator'
          }
        }
      }
    },
    {
      regex: /^\((\w+):([\d-]+)\)/,
      action: {
        token: 'sfunc',
        transform(match) {
          return {
            Type: 'FUNCTION',
            Name: match[1],
            Argument: [
              {
                Type: 'Number',
                Content: Number(match[2])
              }
            ]
          }
        }
      }
    },
    {
      regex: /^\((\d+)\/(\d+)\)/,
      action: {
        token: 'sfunc',
        transform(match) {
          return {
            Type: 'FUNCTION',
            Name: 'BarBeat',
            Argument: [
              {
                Type: 'Number',
                Content: Number(match[1])
              },
              {
                Type: 'Number',
                Content: Number(match[2])
              }
            ]
          }
        }
      }
    },
    {
      regex: /^\(1=([A-G',b#]+)\)/,
      action: {
        token: 'sfunc',
        transform(match) {
          return {
            Type: 'FUNCTION',
            Name: 'Key',
            Argument: [
              {
                Type: 'String',
                Content: match[1]
              }
            ]
          }
        }
      }
    },
    {
      regex: /^\((\d+)%\)/,
      action: {
        token: 'sfunc',
        transform(match) {
          return {
            Type: 'FUNCTION',
            Name: 'Vol',
            Argument: [
              {
                Type: 'Number',
                Content: Number(match[1])
              }
            ]
          }
        }
      }
    },
    {
      regex: /^\((\d+)\)/,
      action: {
        token: 'sfunc',
        transform(match) {
          return {
            Type: 'FUNCTION',
            Name: 'Spd',
            Argument: [
              {
                Type: 'Number',
                Content: Number(match[1])
              }
            ]
          }
        }
      }
    },
    {
      regex: /^\(([+-]\d+)\)/,
      action: {
        token: 'sfunc',
        transform(match) {
          return {
            Type: 'FUNCTION',
            Name: 'KeyShift',
            Argument: [
              {
                Type: 'Number',
                Content: Number(match[1])
              }
            ]
          }
        }
      }
    },
    {
      regex: /^\(/,
      action: {
        token: 'usfunc',
        next: 'Dynamic',
        transform(_, content) {
          return {
            Type: 'Sfunc',
            Content: content
          }
        }
      }
    },
    {
      regex: /^\[(\d+\.)+\]/,
      action: {
        token: 'volta',
        transform(volta) {
          return {
            Type: 'Volta',
            Order: volta[0].slice(1, -1).split('.').slice(0, -1).map((s) => Number(s))
          }
        }
      }
    },
    {
      regex: /^(\+|s|DC|DS|Fine)/,
      action: {
        token: 'repeats',
        transform(match) {
          const map = {
            '+': 'Coda',
            's': 'Segno',
            'DC': 'DaCapo',
            'DS': 'DaSegno',
            'Fine': 'Fine'
          }
          return {
            Type: map[match[1]]
          }
        }
      }
    },
    {
      regex: /^<([A-Za-z0-9]+:)?([A-Za-z0-9]+(\(.+?\))?(, *[A-Za-z0-9]+(\(.+?\))?)*)>/,
      action: {
        token: 'instr',
        transform(instrs) {
          const res = instrs[2].split(',').map((instr) => {
            const info = instr.match(/(\w+)(\(\d+%\))?/)
            return {
              Instrument: info[1],
              Proportion: info[2] === undefined ? null : Number(info[2].slice(1, -2)) / 100
            }
          })
          res.unshift(instrs[1] === undefined ? undefined : instrs[1].slice(0, -1))
          return res
        }
      }
    },
    {
      regex: /^@[a-zA-Z0-9]+/,
      action: {
        token: 'macroIndicator',
        transform(macro) {
          return {
            Type: 'Macrotrack',
            Name: macro[0].slice(1)
          }
        }
      }
    },
    {
      regex: /^([A-Za-z]\w*)\s*\(/,
      action: {
        token: 'func',
        next: 'Func',
        transform(func, content) {
          return {
            Type: 'FUNCTION',
            Name: func[1],
            Argument: content
          }
        }
      }
    },
    {
      regex: /^{(\d+\*)?/,
      action: {
        token: 'subtrack',
        next: 'root',
        transform(subtrack, content) {
          let repeat
          if (subtrack[1] !== undefined) {
            repeat = -subtrack[1].slice(0, -1)
          } else {
            const pos = content.filter((e) => e.Type === 'BarLine' && e.Order[0] > 0)
            if (pos.length > 0) {
              repeat = Math.max(...pos.map((e) => Math.max(...e.Order)))
            } else {
              repeat = -1
            }
          }
          return {
            Type: 'Subtrack',
            Repeat: repeat,
            Content: content
          }
        }
      }
    },
    {
      regex: /^}/,
      action: {
        token: '@pass',
        next: '@pop'
      }
    },
    {
      regex: /^&/,
      action: {
        token: 'pr',
        transform() {
          return {
            Type: 'PedalPress'
          }
        }
      }
    },
    {
      regex: /^\*/,
      action: {
        token: 'pr',
        transform() {
          return {
            Type: 'PedalRelease'
          }
        }
      }
    },
    {
      regex: /^\^/,
      action: {
        token: 'tie',
        transform() {
          return {
            Type: 'Tie'
          }
        }
      }
    },
    {
      regex: /./,
      action: {
        token: 'undef',
        transform(match) {
          return {
            Type: 'Undef',
            Content: match[0]
          }
        }
      }
    }
  ],
  Func: [
    {
      regex: /^\)/,
      action: {
        token: '@pass',
        next: '@pop'
      }
    },
    {
      regex: /^,\s*/,
      action: {
        token: '@pass'
      }
    },
    {
      regex: /^{(\d+\*)?/,
      action: {
        token: 'subtrack',
        next: 'root',
        transform(subtrack, content) {
          let repeat
          if (subtrack[1] !== undefined) {
            repeat = subtrack[1].slice(0, -1)
          } else {
            const pos = content.filter((e) => e.Type === 'BarLine' && e.Order[0] > 0)
            if (pos.length > 0) {
              repeat = Math.max(...pos.map((e) => Math.max(...e.Order)))
            } else {
              repeat = -1
            }
          }
          return {
            Type: 'Subtrack',
            Repeat: repeat,
            Content: content
          }
        }
      }
    },
    {
      regex: /^"([^"]*)"/,
      action: {
        token: 'string',
        transform(str) {
          return {
            Type: 'String',
            Content: str[1]
          }
        }
      }
    },
    {
      regex: /^\[/,
      action: {
        token: 'array',
        next: 'Array',
        transform(_, content) {
          return {
            Type: 'Array',
            Content: content
          }
        }
      }
    },
    {
      regex: /^-?(\d+\/\d+|\d+(\.\d+)?|Log2\(\d+\)([+-]\d+)?)/,
      action: {
        token: 'number',
        transform(num) {
          return {
            Type: 'Expression',
            Content: num[0]
          }
        }
      }
    }
  ],
  Array: [
    {
      regex: /^,\s*/,
      action: {
        token: '@pass'
      }
    },
    {
      regex: /^\]/,
      action: {
        token: '@pass',
        next: '@pop'
      }
    },
    {
      regex: /^{(\d+\*)?/,
      action: {
        token: 'subtrack',
        next: 'root',
        transform(subtrack, content) {
          let repeat
          if (subtrack[1] !== undefined) {
            repeat = subtrack[1].slice(0, -1)
          } else {
            const pos = content.filter((e) => e.Type === 'BarLine' && e.Order[0] > 0)
            if (pos.length > 0) {
              repeat = Math.max(...pos.map((e) => Math.max(...e.Order)))
            } else {
              repeat = -1
            }
          }
          return {
            Type: 'Subtrack',
            Repeat: repeat,
            Content: content
          }
        }
      }
    },
    {
      regex: /^"([^"]*)"/,
      action: {
        token: 'string',
        transform(str) {
          return {
            Type: 'String',
            Content: str[1]
          }
        }
      }
    },
    {
      regex: /^\[/,
      action: {
        token: 'array',
        next: 'Array',
        transform(_, content) {
          return {
            Type: 'Array',
            Content: content
          }
        }
      }
    },
    {
      regex: /^-?(\d+\/\d+|\d+(\.\d+)?|Log2\(\d+\)([+-]\d+)?)/,
      action: {
        token: 'number',
        transform(num) {
          return {
            Type: 'Expression',
            Content: num[0]
          }
        }
      }
    }
  ]
}

const libDef = [
  {
    regex: /^#\s*Chord([^]+?)\n(?=#)/,
    type: 'Chord',
    transform(chords) {
      const result = []
      const chordDefs = chords[1].split(/\n/)
      for (const chordDef of chordDefs) {
        const res = chordDef.match(/^([A-Za-z])\t+([^\t]+\t+)?([^\t]+)/)
        if (res === null) continue
        const parts = res[3].split(',')
        const pitches = []
        for (const part of parts) {
          const num = Number(part)
          if (Number.isNaN(num)) {
            const match = part.trim().match(/\[(.*?)\](-?\d+)?/)
            let delta
            if (match[2] === undefined) {
              delta = 0
            } else {
              delta = Number(match[2])
            }
            if (match[1] === '') {
              pitches.push([1, -1, delta])
            } else {
              const num2 = Number(match[1])
              if (Number.isNaN(num2)) {
                let [head, tail] = match[1].split(';')
                head = Number(head)
                if (tail === '') {
                  tail = -1
                } else {
                  tail = Number(tail)
                }
                pitches.push([head, tail, delta])
              } else {
                pitches.push([num2, num2, delta])
              }
            }
          } else {
            pitches.push([1, 1, num])
          }
        }
        result.push({
          Notation: res[1],
          Comment: res[2],
          Pitches: pitches
        })
      }
      return {
        Type: 'Chord',
        Data: result
      }
    }
  },
  {
    regex: /^#\s*Function([^]+?)\n(?=#)/,
    type: 'Function',
    transform(funcs) {
      return {
        Type: 'Function',
        Data: []
      }
    }
  },
  {
    regex: /^#\s*Track([^]+?)\n(?=#)/,
    type: 'Macro',
    transform(macroAll) {
      const result = []
      const macros = macroAll[0].match(/<\*\w+\*>[^]+?(?=<\*(\w+)\*>|$)/g)
      for (const macro of macros) {
        const [, name, content] = macro.match(/<\*(\w+)\*>([^]+)/)
        result.push({
          Name: name,
          Content: Tokenizer.tokenizeTrack(content)
        })
      }
      return {
        Type: 'Track',
        Data: result
      }
    }
  },
  {
    regex: /^#\s*End/,
    type: '@terminal'
  }
]

export default class Tokenizer {
  /**
   * @param {string} track
   */
  static tokenizeTrack(track) {
    const stateStore = [[]]
    const states = ['root']
    const sfStates = [0]
    const length = track.length
    let depth = 0
    let pointer = 0
    while (pointer < length) {
      const temp = track.slice(pointer)
      const slice = temp.trimLeft()
      if (slice === '') break
      pointer += temp.length - slice.length
      let matched = false
      const patterns = langDef[states[depth]]
      const patternLength = patterns.length

      for (let index = 0; index < patternLength; index++) {
        const element = patterns[index]
        const match = slice.match(element.regex)
        if (match === null) continue
        matched = true
        const action = 'cases' in element.action ? match[0] in element.action.cases ? element.action.cases[match[0]] : element.action.cases['@default'] : element.action
        if (action.token === 'usfunc' || action.token === 'undef') {
          sfStates[depth] += 1
        }
        if ('next' in action) {
          if (action.token !== '@pass') {
            stateStore[depth].push(((p) => (content) => Object.assign(action.transform(match, content), { StartIndex: p }))(pointer))
          }
          if (action.next === '@pop') {
            depth -= 1
            states.pop()
            const state = stateStore.pop()
            Tokenizer.mergeSimplifiedFunc(state, sfStates.pop())
            stateStore[depth].push(stateStore[depth].pop()(state))
          } else {
            stateStore.push([])
            states.push(action.next)
            sfStates.push(0)
            depth += 1
          }
        } else if (action.token !== '@pass') {
          stateStore[depth].push(Object.assign(action.transform(match), { StartIndex: pointer }))
        }
        pointer += match[0].length
        break
      }
      if (!matched) {
        throw new Error() // Temporarily added to debug TODO: remove in the future
        // stateStore.push(track.charAt(pointer))
        // pointer += 1
      }
    }
    const state = stateStore[0]
    Tokenizer.mergeSimplifiedFunc(state, sfStates.pop())
    return state
  }

  static mergeSimplifiedFunc(state, count) {
    if (count === 0) return
    let lastCount = -1
    while (lastCount !== count) {
      lastCount = count
      for (let i = 0; i < sDef.length; i++) {
        const pattern = sDef[i]
        const patternLength = pattern.pat.length
        for (let j = 0; j <= state.length - patternLength; j++) {
          const status = Tokenizer.compare(pattern.pat, patternLength, state, j)
          if (status !== -1) {
            state.splice(j, patternLength, pattern.transform(state.slice(j, j + patternLength)))
            count -= status
            if (count === 0) return
          }
        }
      }
    }
  }

  static compare(pattern, patternLength, state, startIndex) {
    let count = 0
    for (let k = 0; k < patternLength; k++) {
      const part = pattern[k]
      const ori = state[startIndex + k]
      if (!Tokenizer.sameType(part, ori)) return -1
      switch (part.Type) {
      case 'Sfunc':
        for (let l = 0, length = part.Content.length; l < length; l++) {
          if (part.Content[l] instanceof RegExp) {
            if (ori.Content[l].Type !== 'Dyn' || !part.Content[l].test(ori.Content[l].Content)) {
              return -1
            }
          } else if (part.Content[l].Type !== ori.Content[l].Type) {
            return -1
          }
        }
        count += 1
        break
      case 'Undef':
        if (part.Content !== ori.Content) {
          return -1
        }
        count += 1
      }
    }
    return count
  }

  static sameType(pat, sta) {
    return typeof pat.Type === 'string' ? pat.Type === sta.Type : pat.Type.includes(sta.Type)
  }

  static isHeadTrack(track) {
    const heads = ['Volta', 'RepeatBegin', 'RepeatEnd', 'Setting', 'Coda', 'Segno', 'DaCapo', 'DaSegno', 'Fine']
    const settings = ['ConOct', 'Vol', 'Spd', 'Key', 'Oct', 'KeyOct', 'Beat', 'Bar', 'BarBeat', 'Dur', 'Acct', 'Light', 'Seg', 'Port', 'Trace', 'FadeIn', 'FadeOut', 'Rev', 'Ferm', 'Stac']
    return track.every((element) => {
      return heads.includes(element.Type) || (element.Type === 'FUNCTION' && settings.includes(element.Name))
    })
  }

  /**
   * Construct a tokenizer
   * @param {string} content Tm string to tokenize
   */
  constructor(content) {
    this.content = content
    this.include = []
    this.sections = []
    this.baseIndex = 0
    this.sectionIndex = []
    this.trackIndex = []
    this.comments = []
    this.libs = undefined
    this.result = {
      Comments: undefined,
      Library: [],
      Sections: []
    }
  }

  tokenize() {
    this.regularize()
    this.extractHeader()
    this.split()
    for (let i = 0, length = this.sections.length; i < length; i++) {
      const sec = {
        Type: 'Section',
        Comments: this.comments[i],
        Settings: [],
        Tracks: []
      }
      let pointer = 0
      for (const track of this.sections[i]) {
        const tra = Tokenizer.tokenizeTrack(track)
        if (tra[0] instanceof Array) {
          const instr = tra.shift()
          const ID = instr.shift()
          sec.Tracks.push({
            ID,
            Instruments: instr,
            Content: tra
          })
          pointer += 1
        } else if (tra[0].Type === 'LocalIndicator') {
          sec.Settings.push(...tra.slice(1))
          this.trackIndex[i].splice(pointer, 1)
        } else if (Tokenizer.isHeadTrack(tra)) {
          this.result.Sections.push(...tra)
          this.trackIndex[i].splice(pointer, 1)
        } else {
          sec.Tracks.push({
            ID: null,
            Instruments: [],
            Content: tra
          })
          pointer += 1
        }
      }
      if (sec.Settings.length === 0 && sec.Tracks.length === 0) continue
      this.result.Sections.push(sec)
    }
    return this.result
  }

  regularize() {
    this.content = this.content.replace(/\r\n/g, '\n')
  }

  split() {
    const pattern = /(^(\/\/.*)?\n){2,}/mg
    let match
    let lastIndex = 0
    const secs = []
    while ((match = pattern.exec(this.content)) !== null) {
      if (match.index === 0) {
        continue
      } else {
        const tempSec = this.content.slice(lastIndex, match.index)
        if (tempSec.trim() !== '') {
          secs.push(tempSec)
          this.sectionIndex.push(lastIndex)
        }
        lastIndex = match.index
      }
    }
    const tempSec = this.content.slice(lastIndex)
    if (tempSec.trim() !== '') {
      secs.push(tempSec)
      this.sectionIndex.push(lastIndex)
    }
    for (let i = 0, length = secs.length; i < length; i++) {
      let baseIndex = 0
      const comments = []
      const tras = secs[i].replace(/^\/\/(.*)/gm, (str, comment) => {
        baseIndex += str.length
        comments.push(comment)
        return ''
      })
      const temp = this.splitSection(tras, baseIndex)
      this.comments.push(comments)
      this.sections.push(temp.tracks)
      this.trackIndex.push(temp.trackIndex)
    }
  }

  splitSection(content, baseIndex) {
    const pattern = /(^\n)+/mg
    let match
    let lastIndex = 0
    const tracks = []
    const trackIndex = []
    while ((match = pattern.exec(content)) !== null) {
      if (match.index === 0) {
        continue
      } else {
        const tempTrack = content.slice(lastIndex, match.index)
        if (tempTrack.trim() !== '') {
          tracks.push(tempTrack)
          trackIndex.push(lastIndex + baseIndex)
        }
        lastIndex = match.index
      }
    }
    const tempTrack = content.slice(lastIndex)
    if (tempTrack.trim() !== '') {
      tracks.push(tempTrack)
      trackIndex.push(lastIndex + baseIndex)
    }
    return {
      tracks,
      trackIndex
    }
  }

  extractHeader() {
    this.content = this.content.replace(/^\n*(\/\/.*\n)+\n*/, (str) => {
      this.baseIndex += str.length
      this.result.Comments = str.trim().replace(/^\/\//mg, '').split('\n')
      return ''
    })
    if (this.content.startsWith('#')) {
      this.content = this.content.replace(/^#\s*Include\s+"([^"\n]+)\n"/gm, (str, name) => {
        this.baseIndex += str.length
        this.result.Library.push({
          Type: 'Package',
          Path: name,
          Content: new LibTokenizer(name, false).tokenize()
        })
        return ''
      })
      const end = this.content.match(/^#\s*End/m)
      if (end !== null) {
        const libLen = end.index + end[0].length
        this.baseIndex += libLen
        const libstr = this.content.slice(0, libLen)
        this.result.Library.push(...new LibTokenizer(libstr).tokenize())
        this.content = this.content.slice(end.index + end[0].length)
      }
    }
  }
}

class LibTokenizer {
  constructor(content, internal = true) {
    this.inc = []
    this.content = undefined
    if (internal) {
      this.content = content.trim()
    } else {
      this.load(content)
    }
  }

  load(path) {
    const content = '' // TODO: load via http or fs
    this.content = content.replace(/^#\s*Include\s+"([^"]+)"/gm, (str, name) => {
      this.inc.push(name)
      return ''
    })
  }

  tokenize() {
    const result = []
    let pointer = 0
    for (const inc of this.inc) {
      result.push({
        Type: 'Package',
        Path: name,
        Content: new LibTokenizer(inc, false).tokenize()
      })
    }
    while (pointer < this.content.length) {
      const temp = this.content.slice(pointer)
      const slice = temp.trim()
      pointer += temp.length - slice.length

      for (let index = 0; index < libDef.length; index++) {
        const element = libDef[index]
        const match = slice.match(element.regex)
        if (match === null) continue
        if (element.type === '@terminal') return result
        result.push(element.transform(match))
        pointer += match[0].length
        break
      }
    }
    return result
  }
}
