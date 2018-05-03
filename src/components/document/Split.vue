<template>
  <hr :class="[options.dashed ? options.double ? 'dd' : 'dashed' : options.double ? 'double' : 'normal']">
</template>

<script>
// import base from './index'
export default {
  name: 'Split',
  // extends: base,
  props: {
    // content: {
    //   type: Array,
    //   required: true
    // },
    options: {
      type: Object,
      default: () => ({
        dashed: false,
        double: false
      })
    }
  }
}
</script>

<style>
.dd {
  border: none;
  border-top-style: dashed;
  margin: auto;
  position: relative;
}

.dd:before {
  content: '';
  width: 100%;
  border-top-style: dashed;
  position: absolute;
  left: 0%;
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
}
</style>
