<template>
  <hr :class="[node.style === 1 ? node.double ? 'dd' : 'dash' : node.double ? 'double' : 'normal']">
</template>

<script>
export default {
  name: 'Split',
  props: {
    node: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
/*.dd {
  border: none;
  border-top-style: dashed;
  margin: auto;
  position: relative;
}

.dd::before {
  content: '';
  width: 100%;
  border-top-style: dashed;
  position: absolute;
  left: 0;
  top: 8px;
}

.double {
  border: none;
  border-top-style: double;
}

.dash {
  border: none;
  border-top-style: dashed;
}

.normal {
  border: none;
  border-top-style: solid;
}*/

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

hr {
  height: 0;
  margin: 15px 0;
  overflow: hidden;
  background: transparent;
  border: 0;
  border-bottom: 1px solid #dfe2e5;
}

hr::before {
  display: table;
  content: "";
}

hr::after {
  display: table;
  clear: both;
  content: "";
}

hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

hr {
  border-bottom-color: #eee;
}
</style>
