<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-3" style="padding-top: 15%">
        <tm-doc-directory :items="items"></tm-doc-directory>
      </div>
      <div class="col-sm-9" style="padding-top: 5%">
        <tm-doc-container :doc="doc"></tm-doc-container>
      </div>
    </div>
  </div>
</template>

<script>
import TmDocDirectory from './TmDocDirectory'
import TmDocContainer from './TmDocContainer'
const defaultValue = 'main'
export default {
  name: 'TmDoc',
  components: {
    TmDocDirectory,
    TmDocContainer
  },
  data () {
    return {
      doc: defaultValue,
      items: ['main', 'GraceNote', 'Foo']
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.doc = to.params.doc || defaultValue
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
