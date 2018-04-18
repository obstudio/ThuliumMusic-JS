<template>
  <table>
    <thead v-if="content.head">
      <th v-for="(head, index) in content.head" :key="index">
        {{head}}
      </th>
    </thead>
    <tbody>
      <tr v-for="(row, index) in content.body" :key="index">
        <td v-for="(col, colIndex) in row" :key="colIndex">
          {{col}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import base from './index'

export default {
  name: 'Codeblock',
  extends: base,
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
