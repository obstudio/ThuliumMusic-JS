import {edit, merge} from './util'

export const inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  // autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  // url: noop,
  // tag: '^comment' +
  // '|^</[a-zA-Z][\\w:-]*\\s*>' + // self-closing tag
  // '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' + // open tag
  // '|^<\\?[\\s\\S]*?\\?>' + // processing instruction, e.g. <?php ?>
  // '|^<![a-zA-Z]+\\s[\\s\\S]*?>' + // declaration, e.g. <!DOCTYPE html>
  // '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  // strong: /^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)|^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)/,
  strong: /^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)|^\*\*([^\s])\*\*(?!\*)/,
  // em: /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*])\*(?!\*)/,
  em: /^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^\*([^\s*])\*(?!\*)/,
  underline: /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s*])_(?!_)/,
  grey: /^\(\(([^\s][\s\S]*?[^\s])\)\)(?!\))|^\(\(([^\s])\)\)(?!\))/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: /^-(?=\S)([\s\S]*?\S)-/,
  text: /^[\s\S]+?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
}

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g

// inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/
// inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
// inline.autolink = edit(inline.autolink)
//   .replace('scheme', inline._scheme)
//   .replace('email', inline._email)
//   .getRegex()

// inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/

// inline.tag = edit(inline.tag)
//   .replace('comment', block._comment)
//   .replace('attribute', inline._attribute)
//   .getRegex()

inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/
inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?)/
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex()

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .getRegex()

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline)

// inline.pedantic = merge({}, inline.normal, {
//   strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
//   em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
//   link: edit(/^!?\[(label)\]\((.*?)\)/)
//     .replace('label', inline._label)
//     .getRegex(),
//   reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
//     .replace('label', inline._label)
//     .getRegex()
// })
//
// inline.gfm = merge({}, inline.normal, {
//   escape: edit(inline.escape).replace('])', '~|])').getRegex(),
//   url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/)
//     .replace('email', inline._email)
//     .getRegex(),
//   _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
//   del: /^~~(?=\S)([\s\S]*?\S)~~/,
//   text: edit(inline.text)
//     .replace(']|', '~]|')
//     .replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|')
//     .getRegex()
// })
//
// inline.breaks = merge({}, inline.gfm, {
//   br: edit(inline.br).replace('{2,}', '*').getRegex(),
//   text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
// })
