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

<style scoped>
  pre {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    margin-top: 0;
    word-wrap: normal;
    margin-bottom: 0;
    word-break: normal;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
  }
</style>
