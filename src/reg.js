export default {
  install(Vue, options) {
    Vue.prototype.$loadMonaco = function () {
      if ('monaco' in window) {
        return {
          then(f) {
            f()
          }
        }
      } else {
        return new Promise((resolve, reject) => {
          window.require(['vs/editor/editor.main'], () => {
            defineLanguage()
            resolve()
          })
        })
      }
    }
  }
}

const ColorRules = [
  { token: 'undef', foreground: 'FF0000' },
  { token: 'comment', foreground: '008800' },

  { token: 'sfunc', foreground: 'FF909B' },
  { token: 'func', foreground: 'FF909B' },
  { token: 'instr', foreground: 'bf00ff', fontStyle: 'bold' },
  { token: 'macro', foreground: '7CFC00' },
  { token: 'macroIndicator', foreground: 'bf00ff' },
  { token: 'inc', foreground: '7CFC00' },
  { token: 'incPath', foreground: '87CEFA' },

  { token: 'degree', foreground: '00FFFF' },
  { token: 'pitOp-chord', foreground: '00BBFF' },
  { token: 'durOp-stac-volOp', foreground: '00FFBB' },
  { token: 'chordBracket', foreground: '00BBBB' },

  { token: '@bracket', foreground: 'fc8f00' },
  { token: 'volta', foreground: 'FFFF00' },
  { token: 'barline', foreground: 'fc8f00' },
  { token: 'repeat', foreground: 'FFFF00' },
  { token: 'press-release', foreground: 'fcde00' },
  { token: 'tie', foreground: 'fcde00' }
]
const LangDef = {
  tokenizer: {
    root: [
      {
        regex: /\/\/.*/,
        action: {
          token: 'comment'
        }
      },
      {
        regex: /# *Track/,
        action: {
          token: '@rematch',
          next: 'Macro'
        }
      },
      {
        regex: /# *Chord/,
        action: {
          token: '@rematch',
          next: 'ChordDef'
        }
      },
      {
        regex: /# *Include/,
        action: {
          token: '@rematch',
          next: '@Inc'
        }
      },
      {
        regex: /\[(\d+\.)+\]/,
        action: {
          token: 'volta'
        }
      },
      {
        regex: /<[^*]+>/,
        action: {
          token: 'instr'
        }
      },
      {
        include: 'Common'
      }
    ],
    Subtrack: [
      {
        regex: /\d+\*|\/\d*:/,
        action: {
          token: 'repeat'
        }
      },
      {
        regex: /\//,
        action: {
          token: 'repeat'
        }
      },
      {
        regex: /\^\)|\)/,
        action: {
          token: '@rematch',
          next: '@pop'
        }
      },
      {
        include: 'Common'
      }
    ],
    Common: [
      {
        regex: /@[A-Za-z\d]+/,
        action: {
          token: 'macroIndicator'
        }
      },
      {
        regex: /(\$?)([\d%x])/,
        action: [
          {
            token: 'func'
          },
          {
            cases: {
              '@eos': {
                token: 'degree'
              },
              '@default': {
                token: 'degree',
                next: 'NoteOp'
              }
            }
          }
        ]
      },
      {
        regex: /(\$?)(\[)/,
        action: [
          {
            token: 'func'
          },
          {
            token: '@rematch',
            next: 'Chord'
          }
        ]
      },
      {
        regex: /\(/,
        action: {
          token: '@rematch',
          next: 'Sfunc'
        }
      },
      {
        regex: /([A-Z][a-z]+)+\(/,
        action: {
          token: '@rematch',
          next: 'Func'
        }
      },
      {
        regex: /{/,
        action: {
          bracket: '@open',
          token: '@bracket',
          next: 'Subtrack'
        }
      },
      {
        regex: /}/,
        action: {
          bracket: '@close',
          token: '@bracket',
          next: '@pop'
        }
      },
      {
        regex: /&/,
        action: {
          token: 'press-release'
        }
      },
      {
        regex: /\*/,
        action: {
          token: 'press-release'
        }
      },
      {
        regex: /~/,
        action: {
          token: 'func'
        }
      },
      {
        regex: /\^/,
        action: {
          token: 'tie'
        }
      },
      {
        regex: /:\|\|:|:\|\||\|\|:|\|\||\|/,
        action: {
          token: 'barline'
        }
      }
    ],
    Sfunc: [
      {
        regex: /\(\.\)/,
        action: {
          token: 'func',
          next: '@pop'
        }
      },
      {
        regex: /\(\^/,
        action: {
          token: 'func',
          next: 'Subtrack'
        }
      },
      {
        regex: /\(|\^|:|1=/,
        action: {
          token: 'func'
        }
      },
      {
        regex: /{/,
        action: {
          token: '@bracket',
          next: 'Subtrack'
        }
      },
      {
        regex: /[^)]+\^\)/,
        action: {
          token: '@rematch',
          next: 'Subtrack'
        }
      },
      {
        regex: /\^\)/,
        action: {
          token: 'func',
          next: '@pop'
        }
      },
      {
        regex: /\)/,
        action: {
          token: 'func',
          next: '@pop'
        }
      },
      {
        regex: /[A-Za-zb#%\d.\-/]/,
        action: {
          token: 'number'
        }
      }
    ],
    Func: [
      {
        regex: /[A-Z][a-z]+/,
        action: {
          token: 'func'
        }
      },
      {
        regex: /\(/,
        action: {
          token: 'func',
          next: 'Arg'
        }
      },
      {
        regex: /\)/,
        action: {
          token: 'func',
          next: '@pop'
        }
      },
      {
        regex: /,\s*/,
        action: {
          token: 'func',
          next: 'Arg'
        }
      }
    ],
    Array: [
      {
        regex: /\[/,
        action: {
          token: 'func',
          bracket: '@open',
          next: 'Arg'
        }
      },
      {
        regex: /,\s*/,
        action: {
          token: 'func',
          next: 'Arg'
        }
      },
      {
        regex: /\]/,
        action: {
          token: 'func',
          bracket: '@close',
          next: '@pop'
        }
      }
    ],
    Arg: [
      {
        regex: /{/,
        action: {
          token: '@bracket',
          next: 'Subtrack'
        }
      },
      {
        regex: /"[^"]*"/,
        action: {
          token: 'string'
        }
      },
      {
        regex: /\[/,
        action: {
          token: '@rematch',
          next: 'Array'
        }
      },
      {
        regex: /,|\)|\]/,
        action: {
          token: '@rematch',
          next: '@pop'
        }
      },
      {
        regex: /\d+\.\d+|\d+\/\d+|Log2\(\d+\)([+-]\d+)?/,
        action: {
          token: 'number'
        }
      }
    ],
    NoteOp: [
      {
        regex: /[^',b#a-wyzA-Z\-_.=`:>]/,
        action: {
          token: '@rematch',
          next: '@pop'
        }
      },
      {
        include: 'NoteAddon'
      }
    ],
    NoteAddon: [
      {
        regex: /[',b#a-wyzA-Z]/,
        action: {
          cases: {
            '@eos': {
              token: 'pitOp-chord',
              next: '@pop'
            },
            '@default': {
              token: 'pitOp-chord'
            }
          }
        }
      },
      {
        regex: /[-_.=`:>]/,
        action: {
          cases: {
            '@eos': {
              token: 'durOp-stac-volOp',
              next: '@pop'
            },
            '@default': {
              token: 'durOp-stac-volOp'
            }
          }
        }
      }
    ],
    Chord: [
      {
        regex: /\[/,
        action: {
          token: '@rematch',
          next: 'ChordInside'
        }
      },
      {
        regex: /[^',b#a-wyzA-Z\-_.=`:>]/,
        action: {
          token: '@rematch',
          next: '@pop'
        }
      },
      {
        include: 'NoteAddon'
      }
    ],
    ChordInside: [
      {
        regex: /\[/,
        action: {
          token: 'chordBracket'
        }
      },
      {
        regex: /[\d%]/,
        action: {
          token: 'degree'
        }
      },
      {
        regex: /[',b#a-wyzA-Z]/,
        action: {
          token: 'pitOp-chord'
        }
      },
      {
        regex: /[:>]/,
        action: {
          token: 'durOp-stac-volOp'
        }
      },
      {
        regex: /\]/,
        action: {
          token: 'chordBracket',
          next: '@pop'
        }
      }
    ],
    ChordDef: [
      {
        regex: /# *Chord/,
        action: {
          token: 'macro',
          bracket: '@open'
        }
      },
      {
        regex: /# *End/,
        action: {
          token: 'macro',
          bracket: '@close',
          next: '@pop'
        }
      },
      {
        regex: /^.+$/,
        action: {
          token: '@rematch',
          next: 'ChordDefLine'
        }
      }
    ],
    ChordDefLine: [
      {
        regex: /^[a-wyzA-Z]/,
        action: {
          token: 'pitOp-chord'
        }
      },
      {
        regex: /\t+[^\t]+\t+/,
        action: {
          token: 'comment'
        }
      },
      {
        regex: /.*/,
        action: {
          token: 'pitOp-chord',
          next: '@pop'
        }
      }
    ],
    Macro: [
      {
        regex: /# *Track/,
        action: {
          token: 'macro',
          bracket: '@open'
        }
      },
      {
        regex: /<\*[A-Za-z\d]+\*>/,
        action: {
          token: 'macroIndicator'
        }
      },
      {
        regex: /# *End/,
        action: {
          token: 'macro',
          bracket: '@close',
          next: '@pop'
        }
      },
      {
        include: 'Common'
      }
    ],
    Inc: [
      {
        regex: /# *Include/,
        action: {
          token: 'inc'
        }
      },
      {
        regex: /".*"/,
        action: {
          token: 'incPath',
          next: '@pop'
        }
      }
    ],
    Section: [],
    Track: []
  },
  tokenPostfix: '.sml',
  defaultToken: 'undef'
}
function defineLanguage() {
  window.monaco.languages.register({
    id: 'tm',
    extensions: ['tm']
  })
  window.monaco.editor.defineTheme('tm', {
    base: 'vs-dark',
    inherit: true,
    rules: ColorRules,
    colors: {}
  })
  window.monaco.languages.setMonarchTokensProvider('tm', LangDef)
  window.monaco.languages.registerDefinitionProvider('tm', {
    provideDefinition(model, position, token) {
      const matches = model.findMatches(
        '@[A-Za-z0-9]+',
        false,
        true,
        false,
        '',
        true
      )
      const trueMatch = matches.find(
        match =>
          match.range.startLineNumber === position.lineNumber &&
                    match.range.endLineNumber === position.lineNumber &&
                    match.range.startColumn <= position.column &&
                    match.range.endColumn >= position.column
      )
      if (!trueMatch) return
      const def = model.findMatches(
        `<*${trueMatch.matches[0].slice(1)}*>`,
        false,
        false,
        true,
        '',
        false
      )[0]
      return {
        uri: model.uri,
        range: def.range
      }
    }
  })
  window.monaco.languages.registerCompletionItemProvider('tm', {
    triggerCharacters: ['<', '@'],
    provideCompletionItems(model, position, token) {
      const char = model.getValueInRange({
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: position.column - 1,
        endColumn: position.column
      })
      if (char === '<') {
        return [
          {
            label: 'Piano',
            kind: window.monaco.languages.CompletionItemKind.Variable,
            documentation: 'Piano',
            insertText: 'Piano>'
          }
        ]
      } else if (char === '@') {
        const matches = model.findMatches(
          '<\\*([A-Za-z0-9]+)\\*>',
          false,
          true,
          false,
          '',
          true
        )
        return matches.map(match => ({
          label: match.matches[1],
          kind: window.monaco.languages.CompletionItemKind.Variable,
          insertText: match.matches[1]
        }))
      }
      return [
        {
          label: 'Oct',
          kind: window.monaco.languages.CompletionItemKind.Function,
          insertText: ''
        }
      ]
    }
  })
}
