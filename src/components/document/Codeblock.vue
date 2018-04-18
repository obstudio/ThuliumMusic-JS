<template>
  <div v-html="res" v-once></div>
</template>

<script>
// import base from './index'
export default {
  name: 'Codeblock',
  data() {
    return {
      res: ''
    }
  },
  // extends: base,
  props: {
    content: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if ('monaco' in window) {
      window.monaco.editor
        .colorize(this.content, this.options.language)
        .then(res => {
          this.res = res
        })
    } else {
      window.require(['vs/editor/editor.main'], () => {
        defineLanguage()
        window.monaco.editor
          .colorize(this.content, this.options.language)
          .then(res => {
            this.res = res
          })
      })
    }
  }
}
</script>

<style>

</style>
