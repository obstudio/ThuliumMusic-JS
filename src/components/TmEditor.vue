<template>
<div :style="{width, height}">
  <transition mode="in-out">
      <tm-monaco :width="width" :height="height"></tm-monaco>
  </transition>
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
.v-leave-active {
  transition: opacity 1s cubic-bezier(0.19, 1, 0.22, 1) 1s;
}

.v-leave-to {
  opacity: 0;
}
</style>
