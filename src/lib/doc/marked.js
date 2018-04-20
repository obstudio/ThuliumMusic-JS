/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/**
 * Block-Level Grammar
 */
var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: /^ *(`{3,}|~{3,})[ .]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/,
  list: /^( *)((?:[*+-]|\d+\.)) [\s\S]+?(?:\n+(?=\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$))|\n+(?= {0,3}\[((?:\\[[\]]|[^[\]])+)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)((?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))))? *(?:\n+|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)/,
  def: /^ {0,3}\[((?:\\[[\]]|[^[\]])+)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)((?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))))? *(?:\n+|$)/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  paragraph: /^([^\n]+(?:\n?(?! *(`{3,}|~{3,})[ .]*(\S+)? *\n([\s\S]*?)\n? *\2 *(?:\n+|$)|( *)((?:[*+-]|\d+\.)) [\s\S]+?(?:\n+(?=\3?(?:(?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$))|\n+(?= {0,3}\[((?:\\[[\]]|[^[\]])+)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)((?:"(?:\\"|[^"]|"[^"\n]*")*"|'\n?(?:[^'\n]+\n?)*'|\([^()]*\))))? *(?:\n+|$))|\n{2,}(?! )(?!\1(?:[*+-]|\d+\.) )\n*|\s*$)| {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)| *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)|([^\n]+)\n *(=|-){2,} *(?:\n+|$))[^\n]+)+)/,
  text: /^[^\n]+/,
  item: /^( *)((?:[*+-]|\d+\.)) [^\n]*(?:\n(?!\1(?:[*+-]|\d+\.) )[^\n]*)*/,
  bullet: /(?:[*+-]|\d+\.)/
}

/**
 * Block Lexer
 */
class Lexer {
  constructor(options) {
    this.tokens = []
    this.tokens.links = {}
    this.options = options || marked.defaults
    this.rules = block
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/\u00a0/g, ' ')
      .replace(/\u2424/g, '\n')
    return this.token(src, true)
  }
  /**
   * Lexing
   */
  token(src, top) {
    src = src.replace(/^ +$/gm, '')
    var next, loose, cap, bull, b, item, space, i, tag, l, isordered
    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length)
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space'
          })
        }
      }
      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length)
        cap = cap[0].replace(/^ {4}/gm, '')
        this.tokens.push({
          type: 'code',
          text: !this.options.pedantic
            ? cap.replace(/\n+$/, '')
            : cap
        })
        continue
      }
      // fences (gfm)
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length)
        this.tokens.push({
          type: 'code',
          lang: cap[2],
          text: cap[3] || ''
        })
        continue
      }
      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length)
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[2]
        })
        continue
      }
      // hr
      if (cap = this.rules.hr.exec(src)) {
        src = src.substring(cap[0].length)
        this.tokens.push({
          type: 'hr'
        })
        continue
      }
      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length)
        bull = cap[2]
        isordered = bull.length > 1
        this.tokens.push({
          type: 'list_start',
          ordered: isordered,
          start: isordered ? +bull : ''
        })
        // Get each top-level item.
        cap = cap[0].match(this.rules.item)
        next = false
        l = cap.length
        i = 0
        for (; i < l; i++) {
          item = cap[i]
          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length
          item = item.replace(/^ *([*+-]|\d+\.) +/, '')
          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length
            item = !this.options.pedantic
              ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
              : item.replace(/^ {1,4}/gm, '')
          }
          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (this.options.smartLists && i !== l - 1) {
            b = block.bullet.exec(cap[i + 1])[0]
            if (bull !== b && !(bull.length > 1 && b.length > 1)) {
              src = cap.slice(i + 1).join('\n') + src
              i = l - 1
            }
          }
          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item)
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n'
            if (!loose) {
              loose = next
            }
          }
          this.tokens.push({
            type: loose
              ? 'loose_item_start'
              : 'list_item_start'
          })
          // Recurse.
          this.token(item, false)
          this.tokens.push({
            type: 'list_item_end'
          })
        }
        this.tokens.push({
          type: 'list_end'
        })
        continue
      }

      // def
      if (top && (cap = this.rules.def.exec(src))) {
        src = src.substring(cap[0].length)
        if (cap[3]) { cap[3] = cap[3].substring(1, cap[3].length - 1) }
        tag = cap[1].toLowerCase()
        if (!this.tokens.links[tag]) {
          this.tokens.links[tag] = {
            href: cap[2],
            title: cap[3]
          }
        }
        continue
      }
      // table (gfm)
      if (top && (cap = this.rules.table.exec(src))) {
        src = src.substring(cap[0].length)
        item = {
          type: 'table',
          header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
        }
        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right'
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center'
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left'
          } else {
            item.align[i] = null
          }
        }
        for (i = 0; i < item.cells.length; i++) {
          item.cells[i] = item.cells[i]
            .replace(/^ *\| *| *\| *$/g, '')
            .split(/ *\| */)
        }
        this.tokens.push(item)
        continue
      }
      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length)
        this.tokens.push({
          type: 'heading',
          depth: cap[2] === '=' ? 1 : 2,
          text: cap[1]
        })
        continue
      }
      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length)
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n'
            ? cap[1].slice(0, -1)
            : cap[1]
        })
        continue
      }
      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length)
        this.tokens.push({
          type: 'text',
          text: cap[0]
        })
        continue
      }
      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
      }
    }
    return this.tokens
  }
  /**
   * Static Lex Method
   */
  static lex(src, options) {
    return new Lexer(options).lex(src)
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}[\]()#+\-.!_>])/,
  autolink: /^<(scheme:[^\s<>]*|email)>/, /// /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?[a-zA-Z0-9-]+(?:"[^"]*"|'[^']*'|\s[^<'">/\s]*)*?\/?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^[\]]*\]|\\[[\]]|[^[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^_([^\s_](?:[^_]|__)+?[^\s_])_\b|^\*((?:\*\*|[^*])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`]?)\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<![`*]|\b_| {2,}\n|$)/
}

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/

inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex()

inline._inside = /(?:\[[^[\]]*\]|\\[[\]]|[^[\]]|\](?=[^[]*\]))*/
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/

inline.link = edit(inline.link)
  .replace('inside', inline._inside)
  .replace('href', inline._href)
  .getRegex()

inline.reflink = edit(inline.reflink)
  .replace('inside', inline._inside)
  .getRegex()

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline)

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
})

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9-]+\.?)+[^\s<]*|^email/)
    .replace('email', inline._email)
    .getRegex(),
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: edit(inline.text)
    .replace(']|', '~]|')
    .replace('|', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|')
    .getRegex()
})

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
})

/**
 * Inline Lexer & Compiler
 */
class InlineLexer {
  constructor(links, options) {
    this.options = options || marked.defaults
    this.links = links
    this.rules = inline.normal
    this.renderer = this.options.renderer || new Renderer()
    this.renderer.options = this.options
    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.')
    }
    if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks
      } else {
        this.rules = inline.gfm
      }
    } else if (this.options.pedantic) {
      this.rules = inline.pedantic
    }
  }
  /**
   * Lexing/Compiling
   */
  output(src) {
    var out = '', link, text, href, cap
    while (src) {
      // escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length)
        out += cap[1]
        continue
      }
      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length)
        if (cap[2] === '@') {
          text = escape(this.mangle(cap[1]))
          href = 'mailto:' + text
        } else {
          text = escape(cap[1])
          href = text
        }
        out += this.renderer.link(href, null, text)
        continue
      }
      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        cap[0] = this.rules._backpedal.exec(cap[0])[0]
        src = src.substring(cap[0].length)
        if (cap[2] === '@') {
          text = escape(cap[0])
          href = 'mailto:' + text
        } else {
          text = escape(cap[0])
          if (cap[1] === 'www.') {
            href = 'http://' + text
          } else {
            href = text
          }
        }
        out += this.renderer.link(href, null, text)
        continue
      }
      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false
        }
        src = src.substring(cap[0].length)
        out += this.options.sanitize
          ? this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape(cap[0])
          : cap[0]
        continue
      }
      // link
      if (cap = this.rules.link.exec(src)) {
        src = src.substring(cap[0].length)
        this.inLink = true
        out += this.outputLink(cap, {
          href: cap[2],
          title: cap[3]
        })
        this.inLink = false
        continue
      }
      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src)) ||
        (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length)
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ')
        link = this.links[link.toLowerCase()]
        if (!link || !link.href) {
          out += cap[0].charAt(0)
          src = cap[0].substring(1) + src
          continue
        }
        this.inLink = true
        out += this.outputLink(cap, link)
        this.inLink = false
        continue
      }
      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length)
        out += this.renderer.strong(this.output(cap[2] || cap[1]))
        continue
      }
      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length)
        out += this.renderer.em(this.output(cap[2] || cap[1]))
        continue
      }
      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length)
        out += this.renderer.codespan(escape(cap[2].trim(), true))
        continue
      }
      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length)
        out += this.renderer.br()
        continue
      }
      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length)
        out += this.renderer.del(this.output(cap[1]))
        continue
      }
      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length)
        out += this.renderer.text(escape(this.smartypants(cap[0])))
        continue
      }
      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
      }
    }
    return out
  }
  /**
   * Compile Link
   */
  outputLink(cap, link) {
    var href = escape(link.href), title = link.title ? escape(link.title) : null
    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, escape(cap[1]))
  }
  /**
   * Smartypants Transformations
   */
  smartypants(text) {
    if (!this.options.smartypants) { return text }
    return text
      // em-dashes
      .replace(/---/g, '\u2014')
      // en-dashes
      .replace(/--/g, '\u2013')
      // opening singles
      .replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018')
      // closing singles & apostrophes
      .replace(/'/g, '\u2019')
      // opening doubles
      .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201c')
      // closing doubles
      .replace(/"/g, '\u201d')
      // ellipses
      .replace(/\.{3}/g, '\u2026')
  }
  /**
   * Mangle Links
   */
  mangle(text) {
    if (!this.options.mangle) { return text }
    var out = '', l = text.length, i = 0, ch
    for (; i < l; i++) {
      ch = text.charCodeAt(i)
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16)
      }
      out += '&#' + ch + ';'
    }
    return out
  }
  /**
   * Static Lexing/Compiling Method
   */
  static output(src, links, options) {
    var inline = new InlineLexer(links, options)
    return inline.output(src)
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline

/**
 * Renderer
 */
class Renderer {
  constructor(options) {
    this.options = options || {}
  }
  code(code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang)
      if (out != null && out !== code) {
        escaped = true
        code = out
      }
    }
    if (!lang) {
      return '<pre><code>' +
        (escaped ? code : escape(code, true)) +
        '\n</code></pre>'
    }
    return '<pre><code class="' +
      this.options.langPrefix +
      escape(lang, true) +
      '">' +
      (escaped ? code : escape(code, true)) +
      '\n</code></pre>\n'
  }
  blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n'
  }
  html(html) {
    return html
  }
  heading(text, level, raw) {
    return '<h' +
      level +
      ' id="' +
      this.options.headerPrefix +
      raw.toLowerCase().replace(/[^\w]+/g, '-') +
      '">' +
      text +
      '</h' +
      level +
      '>\n'
  }
  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n'
  }
  list(body, ordered, start) {
    var type = ordered ? 'ol' : 'ul', startatt = (ordered && start !== 1) ? (' start="' + start + '"') : ''
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n'
  }
  listitem(text) {
    return '<li>' + text + '</li>\n'
  }
  paragraph(text) {
    return '<p>' + text + '</p>\n'
  }
  table(header, body) {
    return '<table>\n' +
      '<thead>\n' +
      header +
      '</thead>\n' +
      '<tbody>\n' +
      body +
      '</tbody>\n' +
      '</table>\n'
  }
  tablerow(content) {
    return '<tr>\n' + content + '</tr>\n'
  }
  tablecell(content, flags) {
    var type = flags.header ? 'th' : 'td'
    var tag = flags.align
      ? '<' + type + ' style="text-align:' + flags.align + '">'
      : '<' + type + '>'
    return tag + content + '</' + type + '>\n'
  }
  // span level renderer
  strong(text) {
    return '<strong>' + text + '</strong>'
  }
  em(text) {
    return '<em>' + text + '</em>'
  }
  codespan(text) {
    return '<code>' + text + '</code>'
  }
  br() {
    return this.options.xhtml ? '<br/>' : '<br>'
  }
  del(text) {
    return '<del>' + text + '</del>'
  }
  link(href, title, text) {
    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      } catch (e) {
        return text
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return text
      }
    }
    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
      href = resolveUrl(this.options.baseUrl, href)
    }
    var out = '<a href="' + href + '"'
    if (title) {
      out += ' title="' + title + '"'
    }
    out += '>' + text + '</a>'
    return out
  }
  image(href, title, text) {
    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
      href = resolveUrl(this.options.baseUrl, href)
    }
    var out = '<img src="' + href + '" alt="' + text + '"'
    if (title) {
      out += ' title="' + title + '"'
    }
    out += this.options.xhtml ? '/>' : '>'
    return out
  }
  text(text) {
    return text
  }
}

// /**
//  * TextRenderer
//  * returns only the textual part of the token
//  */
// class TextRenderer {
//   text(text) {
//     return text
//   }
//   strong(text) {
//     return text
//   }
//   image(href, title, text) {
//     return '' + text
//   }
//   link() {
//     this.image(...arguments)
//   }
//   br() {
//     return ''
//   }
// }

// // no need for block level renderers

// TextRenderer.prototype.strong =
//     TextRenderer.prototype.em =
//     TextRenderer.prototype.codespan =
//     TextRenderer.prototype.del =

// TextRenderer.prototype.link =

/**
 * Parsing & Compiling
 */
class Parser {
  constructor(options) {
    this.tokens = []
    this.token = null
    this.options = options || marked.defaults
    this.options.renderer = this.options.renderer || new Renderer()
    this.renderer = this.options.renderer
    this.renderer.options = this.options
  }
  /**
   * Parse Loop
   */
  parse(src) {
    this.inline = new InlineLexer(src.links, this.options)
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer(src.links, merge({}, this.options/* , { renderer: new TextRenderer() } */))
    this.tokens = src.reverse()
    var out = ''
    while (this.next()) {
      out += this.tok()
    }
    return out
  }
  /**
   * Next Token
   */
  next() {
    /* eslint-disable-next-line no-return-assign */
    return this.token = this.tokens.pop()
  }
  /**
   * Preview Next Token
   */
  peek() {
    return this.tokens[this.tokens.length - 1] || 0
  }
  /**
   * Parse Text Tokens
   */
  parseText() {
    var body = this.token.text
    while (this.peek().type === 'text') {
      body += '\n' + this.next().text
    }
    return this.inline.output(body)
  }
  /**
   * Parse Current Token
   */
  tok() {
    switch (this.token.type) {
    case 'space': {
      return ''
    }
    case 'hr': {
      return this.renderer.hr()
    }
    case 'heading': {
      return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, unescape(this.inlineText.output(this.token.text)))
    }
    case 'code': {
      return this.renderer.code(this.token.text, this.token.lang, this.token.escaped)
    }
    case 'table': {
      var header = '', body = '', i, row, cell, j
      // header
      cell = ''
      for (i = 0; i < this.token.header.length; i++) {
        cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] })
      }
      header += this.renderer.tablerow(cell)
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i]
        cell = ''
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] })
        }
        body += this.renderer.tablerow(cell)
      }
      return this.renderer.table(header, body)
    }
    case 'blockquote_start': {
      body = ''
      while (this.next().type !== 'blockquote_end') {
        body += this.tok()
      }
      return this.renderer.blockquote(body)
    }
    case 'list_start': {
      body = ''
      var ordered = this.token.ordered, start = this.token.start
      while (this.next().type !== 'list_end') {
        body += this.tok()
      }
      return this.renderer.list(body, ordered, start)
    }
    case 'list_item_start': {
      body = ''
      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok()
      }
      return this.renderer.listitem(body)
    }
    case 'loose_item_start': {
      body = ''
      while (this.next().type !== 'list_item_end') {
        body += this.tok()
      }
      return this.renderer.listitem(body)
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text
      return this.renderer.html(html)
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text))
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText())
    }
    }
  }
  /**
   * Static Parse Method
   */
  static parse(src, options) {
    var parser = new Parser(options)
    return parser.parse(src)
  }
}

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase()
    if (n === 'colon') return ':'
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1))
    }
    return ''
  })
}

function edit(regex, opt) {
  regex = regex.source
  opt = opt || ''
  return {
    replace(name, val) {
      val = val.source || val
      val = val.replace(/(^|[^[])\^/g, '$1')
      regex = regex.replace(name, val)
      return this
    },
    getRegex() {
      return new RegExp(regex, opt)
    }
  }
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/'
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '')
    }
  }
  base = baseUrls[' ' + base]

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href
  } else {
    return base + href
  }
}
var baseUrls = {}
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i

function noop() {}
noop.exec = noop

function merge(obj, ...r) {
  return Object.assign(obj, ...r)
}

/**
 * Marked
 */
function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null')
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type ' +
          Object.prototype.toString.call(src) + ', string expected')
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt
      opt = null
    }

    opt = merge({}, marked.defaults, opt || {})

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

    var done = function(err) {
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
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done()
        }
        return highlight(token.text, token.lang, function(err, code) {
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
  try {
    if (opt) opt = merge({}, marked.defaults, opt)
    return Parser.parse(Lexer.lex(src, opt), opt)
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.'
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>' +
            escape(e.message + '', true) +
            '</pre>'
    }
    throw e
  }
}

module.exports = marked

/**
 * Options
 */

marked.options =
    marked.setOptions = function(opt) {
      merge(marked.defaults, opt)
      return marked
    }

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer(),
  xhtml: false,
  baseUrl: null
}

/**
 * Expose
 */

marked.Parser = Parser
marked.parser = Parser.parse
marked.Renderer = Renderer
marked.Lexer = Lexer
marked.lexer = Lexer.lex
marked.InlineLexer = InlineLexer
marked.inlineLexer = InlineLexer.output
marked.parse = marked
