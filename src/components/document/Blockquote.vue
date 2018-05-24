<template>
  <blockquote>
    <component v-for="(comp, index) in node.content" :is="comp.type" :node="comp" :key="index"></component>
  </blockquote>
</template>

<script>
export default {
  name: 'Blockquote',
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
  blockquote {
    margin: 0 0 16px;
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }

  blockquote>:first-child {
    margin-top: 0;
  }

  blockquote>:last-child {
    margin-bottom: 0;
  }
</style>
