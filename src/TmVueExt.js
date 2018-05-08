import Player from './lib/player'
// import { defineLanguage } from './Editor'
import {InlineLexer, Lexer} from './lib/doc/'
window.InlineLexer = InlineLexer
window.Lexer = Lexer
export default (Vue) => {
  Vue.prototype.$createPlayer = (v) => new Player(v)
  // const md = Markdown.setOptions({
  //   highlight (code, lang, cb) {
  //     if ('monaco' in window) {
  //       window.monaco.editor.colorize(code, lang).then((res) => cb(null, `<div class=tm>${res}</div>`))
  //     } else {
  //       window.require(['vs/editor/editor.main'], () => {
  //         defineLanguage()
  //         window.monaco.editor.colorize(code, lang).then((res) => cb(null, `<div class=tm>${res}</div>`))
  //       })
  //     }
  //   }
  // })
  Vue.prototype.$md = (content) => {
    if (typeof content !== 'string') return []
    // const inline = new InlineLexer(result.links)
    return new Lexer().lex(content)
    // {
    //   result,
    //   inline (content) {
    //     return inline.output(content)
    //   }
    // }
  }
}
