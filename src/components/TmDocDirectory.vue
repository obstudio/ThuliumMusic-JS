<template>
  <b-nav vertical class="nav-pills">
    <b-nav-item v-for="(item, index) in items" :key="index" :to="makeURL(item)" :active="active === index" @click="toggle(index)">
      {{item}}
    </b-nav-item>
  </b-nav>
</template>

<script>
export default {
  name: 'TmDocDirectory',
  data() {
    return {
      active: 0
    }
  },
  methods: {
    makeURL (name) {
      return `/doc/${name}`
    },
    toggle (index) {
      this.active = index
    }
  },
  props: ['items']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
