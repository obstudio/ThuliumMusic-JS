<template>
  <div v-html="content">
  </div>
</template>

<script>
export default {
  name: 'TmDocContainer',
  data() {
    return {
      content: ''
    }
  },
  methods: {
    async fetchDoc(name) {
      const doc = await fetch(`/static/docs/${name}.tmd`)
      const text = await doc.text()
      return text
    },
    setContent() {
      this.fetchDoc(this.doc).then(ret => {
        this.$md.parse(ret, (err, res) => {
          if (err) {
            return
          }
          this.content = res
        })
        /* this.content = ret
        this.$nextTick(() => {
          new Promise((resolve, reject) => {
            window.require(['vs/editor/editor.main'], () => {
              defineLanguage()
              resolve()
            })
          }).then(() => {
            const codes = this.$el.getElementsByClassName('language-tm')
            Array.prototype.forEach.call(codes, el => {
              el.setAttribute('data-lang', 'tm')
              window.monaco.editor.colorizeElement(el, { theme: 'tm' })
            })
          })
        }) */
      })
    }
  },
  created() {
    this.setContent()
  },
  watch: {
    doc(val) {
      this.doc = val
      this.setContent()
    }
  },
  props: ['doc']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tm {
  display: block;
  background-color: black;
  padding: 10px;
}
</style>
