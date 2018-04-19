<template>
  <ol v-if="options.ordered">
    <li v-for="(comp, index) in content" :key="index">
      <component :is="comp.type" :content="comp.content" :options="comp.options"></component>    
    </li>
  </ol>
  <ul v-else>
    <li v-for="(comp, index) in content" :key="index">
      <component :is="comp.type" :content="comp.content" :options="comp.options"></component>    
    </li>
  </ul>
</template>

<script>
import base from './index'

export default {
  name: 'List',
  extends: base,
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
