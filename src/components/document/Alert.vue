<template>
  <el-alert :type="options.type">
    <component v-for="(comp, index) in content" :is="comp.type" :content="comp.content" :options="comp.options" :key="index"></component>
  </el-alert>
</template>

<script>
// import base from './index'
export default {
  name: 'Alert',
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
  }
}
</script>

<style>

</style>
