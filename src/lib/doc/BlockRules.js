import {edit} from './util'

export const block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: /^ *(`{3,})[ .]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  hr: /^ {0,3}([-=])(\1|\.\1| \1)\2+ *(?:\n+|$)/,
  section: /^ *(\^{1,6}) *([^\n]+?) *(?:\^+ *)?(?:\n+|$)/,
  heading: /^ *(#{1,6}) +([^\n]+?) *(#*) *(?:\n+|$)/,
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  blockquote: /^( {0,3}[>?] ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  inlinelist: /^((?: *\+[^\n]*[^+\n]\n(?= *\+))*(?: *\+[^\n]+\+?(?:\n+|$)))/,
  def: /^ {0,3}\[((?!\s*])(?:\\[\[\]]|[^\[\]])+)]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)((?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))))? *(?:\n+|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/,
  paragraph: /^([^\n]+(?:\n?(?!hr|heading| {0,3}>)[^\n]+)+)/,
  text: /^[^\n]+/
  // lheading: /^([^\n]+)\n *([=\-]){2,} *(?:\n+|$)/,
  // paragraph: /^([^\n]+(?:\n?(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)+)/,
  // fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  // html: '^ {0,3}(?:' + // optional indentation
  // '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' + // (1)
  // '|comment[^\\n]*(\\n+|$)' + // (2)
  // '|<\\?[\\s\\S]*?\\?>\\n*' + // (3)
  // '|<![A-Z][\\s\\S]*?>\\n*' + // (4)
  // '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' + // (5)
  // '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' + // (6)
  // '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' + // (7) open tag
  // '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' + // (7) closing tag
  // ')',
}

// block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/
// block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/

block.bullet = /(?:-|\d+\.)/
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex()
block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex()

// block._tag = 'address|article|aside|base|basefont|blockquote|body|caption' +
//   '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' +
//   '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' +
//   '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' +
//   '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' +
//   '|track|ul'
// block._comment = /<!--(?!-?>)[\s\S]*?-->/
// block.html = edit(block.html, 'i')
//   .replace('comment', block._comment)
//   .replace('tag', block._tag)
//   .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
//   .getRegex()

block.paragraph = edit(block.paragraph)
  .replace('hr', block.hr)
  .replace('heading', block.heading)
  // .replace('lheading', block.lheading)
  // .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex()

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex()

block.paragraph = edit(block.paragraph)
  .replace('(?!', '(?!' +
    block.fences.source.replace('\\1', '\\2') + '|' +
    block.list.source.replace('\\1', '\\3') + '|')
  .getRegex()
