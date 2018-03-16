<template>
<div :style="{width, height}">
  <tm-loading :loaded="loaded" v-if="show" @transitionend.native="destroy"></tm-loading>
  <tm-monaco v-if="loaded" :width="width" :height="height"></tm-monaco>
</div>
</template>

<script>
import TmLoading from './TmLoading.vue'
import TmMonaco from './TmMonacoEditor.vue'

export default {
  name: 'TmEditor',
  components: {
    TmLoading,
    TmMonaco
  },
  data() {
    return {
      loaded: false,
      show: true
    }
  },
  mounted() {
    this.$loadMonaco().then(() => {
      this.loaded = true
    })
  },
  methods: {
    destroy () {
      this.show = false
    }
  },
  props: ['width', 'height']
}
</script>

<style>

</style>
