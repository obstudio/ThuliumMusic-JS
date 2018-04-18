<template>
  <el-alert :type="options.type">
    {{content}}
  </el-alert>
</template>

<script>
// import base from './index'
export default {
  name: 'Alert',
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
