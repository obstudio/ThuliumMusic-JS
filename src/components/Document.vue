<template>
  <div>
    <component v-for="(comp, index) in content" :is="comp.type" :content="comp.content" :options="comp.options" :key="index"></component>    
  </div>
</template>

<script>
import base from './document/index'

export default {
  name: 'Document',
  extends: base,
  props: {
    content: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>
