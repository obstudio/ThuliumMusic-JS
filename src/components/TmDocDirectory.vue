<template>
<el-menu default-active="1" :router="true">
  <el-menu-item v-for="(item, index) in items" :key="index" :index="makeURL(item)">
    <i class="el-icon-menu"></i>
    <span slot="title">{{item}}</span>
  </el-menu-item>
</el-menu>
</template>

<script>
export default {
  name: 'TmDocDirectory',
  data() {
    return {}
  },
  methods: {
    makeURL (name) {
      return `/doc/${name}`
    }
  },
  props: ['items']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
