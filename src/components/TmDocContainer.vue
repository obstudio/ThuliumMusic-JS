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
    async render(name) {
      const doc = await fetch(`/static/doc/${name}.tmd`)
      const text = await doc.text()
      return this.$md.render(text)
    },
    setContent() {
      this.render(this.doc).then(ret => {
        this.content = ret
        this.$nextTick(() => {
          new Promise((resolve, reject) => {
            window.require(['vs/editor/editor.main'], () => {
              import('@/Editor').then(resolve)
            })
          }).then(() => {
            const codes = this.$el.getElementsByClassName('language-tm')
            Array.prototype.forEach.call(codes, el => {
              el.setAttribute('data-lang', 'tm')
              window.monaco.editor.colorizeElement(el, { theme: 'tm' })
            })
          })
        })
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
