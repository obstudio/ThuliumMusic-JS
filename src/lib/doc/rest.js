/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

'use strict'

/**
 * Block-Level Grammar
 */



/**
 * Expose
 */

marked.Parser = Parser
marked.parser = Parser.parse

marked.Lexer = Lexer
marked.lexer = Lexer.lex

marked.parse = marked
module.exports = marked

console.log(marked('\\\\'))
