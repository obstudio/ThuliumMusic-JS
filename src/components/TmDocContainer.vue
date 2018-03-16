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
        const codes = this.$el.getElementsByTagName('code')
        console.log(codes)
        this.$nextTick(() =>
          Array.prototype.forEach.call(
            codes,
            el => {
              // el.className = ''
              el.setAttribute(
                'data-lang',
                'tm'
              )
              window.monaco.editor.colorizeElement(el, {theme: 'tm'})
            }
          )
        )
      })
    }
  },
  created() {
    this.$loadMonaco().then(() => this.setContent())
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
<style scoped>

</style>
