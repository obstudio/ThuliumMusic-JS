<template>
  <pre v-html="res"></pre>
</template>

<script>
import * as monaco from 'monaco-editor'
import {defineLanguage} from '../../Editor'
export default {
  name: 'Code',
  data() {
    return {
      res: ''
    }
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  watch: {
    node(newNode) {
      monaco.editor
        .colorize(newNode.code, newNode.lang)
        .then(res => {
          this.res = res
        })
    }
  },
  mounted() {
    defineLanguage()
    monaco.editor
      .colorize(this.node.code, this.node.lang)
      .then(res => {
        this.res = res
      })
  }
}
</script>

<style>

</style>
