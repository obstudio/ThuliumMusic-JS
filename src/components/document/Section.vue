<template>
  <div>
    <component :is="'h'+node.level" v-html="node.text"></component>
    <div style="margin-left: 20px">
      <component v-for="(comp, index) in node.content" :is="comp.type" :node="comp" :key="index"></component>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Section',
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0;
  }

  h1 {
    font-size: 32px;
    font-weight: 600;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
  }

  h5 {
    font-size: 14px;
    font-weight: 600;
  }

  h6 {
    font-size: 12px;
    font-weight: 600;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    padding-bottom: 0.3em;
    font-size: 2em;
    border-bottom: 1px solid #eaecef;
  }

  h2 {
    padding-bottom: 0.3em;
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.875em;
  }

  h6 {
    font-size: 0.85em;
    color: #6a737d;
  }
</style>
