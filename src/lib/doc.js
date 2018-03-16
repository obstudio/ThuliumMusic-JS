const Markdown = require('markdown-it')
const md = new Markdown()
export default async function render() {
  const doc = await fetch('/static/GraceNote.tmd')
  const text = await doc.text()
  return md.render(text)
}
