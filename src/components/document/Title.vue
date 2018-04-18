<template>
  <component :is="'h'+options.size">
    {{content}}
  </component>
</template>

<script>
// import base from './index'

export default {
  name: 'Title',
  // extends: base,
  props: {
    content: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
