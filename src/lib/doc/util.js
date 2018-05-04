export function edit(regex, opt) {
  regex = regex.source || regex
  opt = opt || ''
  return {
    replace: function (name, val) {
      val = val.source || val
      val = val.replace(/(^|[^\[])\^/g, '$1')
      regex = regex.replace(name, val)
      return this
    },
    getRegex: function () {
      return new RegExp(regex, opt)
    }
  }
}

export function noop() {}
noop.exec = noop

export function merge(obj, ...rest) {
  return Object.assign(obj, ...rest)
}

export const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i

const baseUrls = {}
export function resolveUrl(base, href) {
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

export function splitCells(tableRow, count) {
  var cells = tableRow.replace(/([^\\])\|/g, '$1 |').split(/ +\| */),
    i = 0

  if (cells.length > count) {
    cells.splice(count)
  } else {
    while (cells.length < count) cells.push('')
  }

  for (; i < cells.length; i++) {
    cells[i] = cells[i].replace(/\\\|/g, '|')
  }
  return cells
}

export function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function (_, n) {
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
