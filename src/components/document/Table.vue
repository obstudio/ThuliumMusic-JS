<template>
  <table>
<!--    <thead v-if="content.head">
      <th v-for="(head, index) in content.head" :key="index">
        {{head}}
      </th>
    </thead>
    <tbody>-->
    <tr v-for="(row, index) in node.content" :key="index">
      <td v-for="(col, colIndex) in row" :key="colIndex" v-html="col.text" :class="{em: col.em}" :style="{'text-align': align(col.al)}"></td>
    </tr>
    <!--</tbody>-->
  </table>
</template>

<script>
export default {
  name: 'Table',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  methods: {
    align(al) {
      switch (al) {
      case 1:
        return 'left'
      case 2:
        return 'center'
      case 3:
        return 'right'
      default:
        return 'left'
      }
    }
  }
}
</script>

<style>
.em {
  font-weight: bold;
}

table {
  border-spacing: 0;
  border-collapse: collapse;
}

table {
  margin-top: 0;
  margin-bottom: 16px;
}

table {
  display: block;
  width: 100%;
  overflow: auto;
}

table th {
  font-weight: 600;
}

table th, table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

td, th {
  padding: 0;
}
</style>
