<template>
  <div v-if="data.type === 'Document'">
    <document-node v-for="(comp, index) in data.content" :data="comp" :key="index"></document-node>    
  </div>
  <div v-else-if="data.type === 'Alert'">
    <el-alert :type="data.options.type">
      {{data.content}}
    </el-alert>
  </div>
  <div v-else-if="data.type === 'Codeblock'">
    <div v-html="res" v-once></div>
  </div>
  <div v-else-if="data.type === 'List'">
    <ol v-if="data.options.ordered">
      <li v-for="(comp, index) in data.content" :key="index">
        <document-node :is="comp.type" :data="comp"></document-node>    
      </li>
    </ol>
    <ul v-else>
      <li v-for="(comp, index) in data.content" :key="index">
        <document-node :is="comp.type" :data="comp"></document-node>    
      </li>
    </ul>  
  </div>
  <div v-else-if="data.type === 'Split'">
    <hr>
  </div>
  <div v-else-if="data.type === 'Table'">
    <table>
      <thead v-if="data.content.head">
        <th v-for="(head, index) in data.content.head" :key="index">
          {{head}}
        </th>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data.content.body" :key="index">
          <td v-for="(col, colIndex) in row" :key="colIndex">
            {{col}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else-if="data.type === 'Textblock'">
    <p>
      {{data.content}}
    </p>
  </div>
  <div v-else-if="data.type === 'Title'">
    <component :is="'h'+data.options.size">
      {{data.content}}
    </component>
  </div>
</template>

<script>
export default {
  name: 'DocumentNode',
  props: ['data'],
  data() {
    return {
      res: ''
    }
  },
  created() {
    if (this.data.type === 'Codeblock') {
      if ('monaco' in window) {
        window.monaco.editor
          .colorize(this.content, this.options.language)
          .then(res => {
            this.res = res
          })
      } else {
        window.require(['vs/editor/editor.main'], () => {
          defineLanguage()
          window.monaco.editor
            .colorize(this.content, this.options.language)
            .then(res => {
              this.res = res
            })
        })
      }
    }
  }
}
</script>

<style>

</style>
