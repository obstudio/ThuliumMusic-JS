<template>
<div :style="{width, height}">
  <tm-monaco :width="width" :height="height"></tm-monaco>
</div>
</template>

<script>
import TmLoading from './TmLoading.vue'

export default {
  name: 'TmEditor',
  components: {
    TmLoading,
    TmMonaco: () => ({
      component: import(/* webpackChunkName: "monaco" */'./TmMonacoEditor.vue'),
      loading: TmLoading,
      error: TmLoading,
      delay: 200,
      timeout: 20000
    })
  },
  props: ['width', 'height']
}
</script>

<style>

</style>
