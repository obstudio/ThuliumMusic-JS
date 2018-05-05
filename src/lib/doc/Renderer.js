import {originIndependentUrl, resolveUrl, escape, unescape} from './util'

export class Renderer {
  constructor(options) {
    this.options = options
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
    if (this.options.headerIds) {
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
    // ignore IDs
    return '<h' + level + '>' + text + '</h' + level + '>\n'
  }

  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n'
  }

  list(body, ordered, start) {
    var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : ''
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n'
  }

  listitem(text) {
    return '<li>' + text + '</li>\n'
  }

  paragraph(text) {
    return '<p>' + text + '</p>\n'
  }

  table(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>'

    return '<table>\n' +
      '<thead>\n' +
      header +
      '</thead>\n' +
      body +
      '</table>\n'
  }

  tablerow(content) {
    return '<tr>\n' + content + '</tr>\n'
  }

  tablecell(content, flags) {
    var type = flags.header ? 'th' : 'td'
    var tag = flags.align
      ? '<' + type + ' align="' + flags.align + '">'
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
    try {
      href = encodeURI(href).replace(/%25/g, '%')
    } catch (e) {
      return text
    }
    var out = '<a href="' + escape(href) + '"'
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

export class TextRenderer {
  /**
   * TextRenderer
   * returns only the textual part of the token
   */
  strong(text) {
    return text
  }

  em(text) {
    return text
  }

  codespan(text) {
    return text
  }

  del(text) {
    return text
  }

  text(text) {
    return text
  }

  link(href, title, text) {
    return '' + text
  }

  image(href, title, text) {
    return '' + text
  }

  br() {
    return ''
  }
}
