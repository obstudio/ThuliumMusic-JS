<template>
  <p v-html="node.text"></p>
</template>

<script>
export default {
  name: 'Paragraph',
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
  p {
    margin-top: 0;
    margin-bottom: 16px;
  }
</style>
