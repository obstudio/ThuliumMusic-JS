<template>
  <ul v-if="node.inline" class="tm-horizontal">
    <li v-for="(item, index) in node.content" :key="index" v-html="item"></li>
  </ul>
  <ul v-else-if="!node.ordered">
    <li v-for="(item, index) in node.content" :key="index">
      <component v-for="(comp, index) in item.content" :key="index" :is="comp.type" :node="comp"></component>
    </li>
  </ul>
  <ol v-else>
    <li v-for="(item, index) in node.content" :key="index">
      <component v-for="(comp, index) in item.content" :key="index" :is="comp.type" :node="comp"></component>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'List',
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
  .tm-horizontal {
    list-style: none;
    padding-top: 20px;
  }

  .tm-horizontal li {
    display: inline;
  }

  ul, ol {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  ol ol, ul ol {
    list-style-type: lower-roman;
  }

  ul ul ol, ul ol ol, ol ul ol, ol ol ol {
    list-style-type: lower-alpha;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 2em;
  }

  ul ul, ul ol, ol ol, ol ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  li {
    word-wrap: break-all;
  }

  li > p {
    margin-top: 16px;
  }

  li + li {
    margin-top: 0.25em;
  }
</style>
