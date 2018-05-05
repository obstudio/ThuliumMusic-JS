import {merge} from './util'
import defaults from './defaults'
import Lexer from './Lexer'
import Parser from './Parser'
export {default as InlineLexer} from './InlineLexer'

export function marked(src, opt, callback) {
  // // throw error in case of non string input
  // if (typeof src === 'undefined' || src === null) {
  //   throw new Error('marked(): input parameter is undefined or null')
  // }
  // if (typeof src !== 'string') {
  //   throw new Error('marked(): input parameter is of type ' +
  //     Object.prototype.toString.call(src) + ', string expected')
  // }
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt
      opt = null
    }

    opt = merge({}, defaults, opt || {})

    var highlight = opt.highlight,
      tokens,
      pending,
      i = 0

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e)
    }

    pending = tokens.length

    var done = function (err) {
      if (err) {
        opt.highlight = highlight
        return callback(err)
      }

      var out

      try {
        out = Parser.parse(tokens, opt)
      } catch (e) {
        err = e
      }

      opt.highlight = highlight

      return err
        ? callback(err)
        : callback(null, out)
    }

    if (!highlight || highlight.length < 3) {
      return done()
    }

    delete opt.highlight

    if (!pending) return done()

    for (; i < tokens.length; i++) {
      (function (token) {
        if (token.type !== 'code') {
          return --pending || done()
        }
        return highlight(token.text, token.lang, function (err, code) {
          if (err) return done(err)
          if (code == null || code === token.text) {
            return --pending || done()
          }
          token.text = code
          token.escaped = true
          --pending || done()
        })
      })(tokens[i])
    }

    return
  }
  if (opt) opt = merge({}, marked.defaults, opt)
  return Parser.parse(Lexer.lex(src, opt), opt)
}
