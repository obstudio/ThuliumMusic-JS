<template>
<div>
  <textarea v-model="raw" title="输入测试"></textarea>
  <Document :content="root"></Document>
</div>
</template>

<script>
import Document from './Document.vue'
export default {
  name: 'TmDocContainer',
  components: {Document},
  data() {
    return {
      raw: null
    }
  },
  computed: {
    root() {
      console.log(this.$md(this.raw))
      return this.$md(this.raw)
    }
  },
  methods: {
    async fetchDoc(name) {
      const doc = await fetch(`/static/docs/${name}.tmd`)
      return doc.text()
    },
    setContent() {
      this.fetchDoc(this.doc).then(ret => {
        this.content = this.$md(ret)
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

</style>
