const Markdown = require('markdown-it')

export default {
  install(Vue, options) {
    const md = new Markdown({})
    // md.inline.ruler.push('gray', (state, silent) => {
    //   var i, scanned, token,
    //     start = state.pos,
    //     marker = state.src.charCodeAt(start)

    //   if (silent) { return false }

    //   if (marker !== 40) { return false }

    //   scanned = state.scanDelims(state.pos, true)
    //   if (scanned.length < 2) return
    //   token = state.push('text', '', 0)
    //   token.content = '('
    //   state.delimiters.push({
    //     // Char code of the starting marker (number).
    //     //
    //     marker: '((',

    //     // Total length of these series of delimiters.
    //     //
    //     length: scanned.length,

    //     // An amount of characters before this one that's equivalent to
    //     // current one. In plain English: if this delimiter does not open
    //     // an emphasis, neither do previous `jump` characters.
    //     //
    //     // Used to skip sequences like "*****" in one step, for 1st asterisk
    //     // value will be 0, for 2nd it's 1 and so on.
    //     //
    //     jump: 0,

    //     // A position of the token this delimiter corresponds to.
    //     //
    //     token: state.tokens.length - 1,

    //     // Token level.
    //     //
    //     level: state.level,

    //     // If this delimiter is matched as a valid opener, `end` will be
    //     // equal to its position, otherwise it's `-1`.
    //     //
    //     end: -1,

    //     // Boolean flags that determine if this delimiter could open or close
    //     // an emphasis.
    //     //
    //     open: scanned.can_open,
    //     close: scanned.can_close
    //   })

    //   state.pos += scanned.length
    //   return true
    // })
    md.block.ruler.before('table', 'usage', (state, startLine, endLine, silent) => {
      /* eslint-disable-next-line one-var */
      var ch, token, level,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine]

      // if it's indented more than 3 spaces, it should be a code block
      if (state.sCount[startLine] - state.blkIndent >= 4) { return false }

      ch = state.src.charCodeAt(pos)

      if ((ch !== 63 && ch !== 45) || pos >= max) { return false }
      if (ch === 45) {
        ch = state.src.charCodeAt(++pos)
        if (ch !== 63) return false
        level = 3
      } else {
        level = 2
      }
      if (silent) { return true }

      pos += 1
      state.line = startLine + 1

      token = state.push('usage_open', 'h' + level, 1)
      token.markup = '?'
      token.map = [ startLine, state.line ]

      token = state.push('inline', '', 0)
      token.content = state.src.slice(pos, max).trim()
      token.map = [ startLine, state.line ]
      token.children = []

      token = state.push('heading_close', 'h' + level, -1)
      token.markup = '?'

      return true
    })
    md.block.ruler.before('table', 'wrap', (state, startLine, endLine, silent) => {
      /* eslint-disable-next-line one-var */
      var ch, token,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine]

      // if it's indented more than 3 spaces, it should be a code block
      if (state.sCount[startLine] - state.blkIndent >= 4) { return false }

      ch = state.src.charCodeAt(pos)

      if (ch !== 94 || pos >= max) { return false }

      ch = state.src.charCodeAt(++pos)
      if (ch !== 94) {
        pos--
      }

      if (silent) { return true }

      pos += 1
      state.line = startLine + 1

      token = state.push('usage_open', 'a', 1)
      token.attrSet('href', '#')
      token.markup = '^'
      token.map = [ startLine, state.line ]

      token = state.push('inline', '', 0)
      token.content = state.src.slice(pos, max).trim()
      token.map = [ startLine, state.line ]
      token.children = []

      token = state.push('heading_close', 'a', -1)
      token.markup = '^'

      return true
    })
    Vue.prototype.$md = md
  }
}
