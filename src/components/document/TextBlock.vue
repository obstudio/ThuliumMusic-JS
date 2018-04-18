<template>
  <p>
    {{content}}
  </p>
</template>

<script>
import base from './index'

export default {
  name: 'Codeblock',
  extends: base,
  props: {
    content: {
      type: String,  // needs detail
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
