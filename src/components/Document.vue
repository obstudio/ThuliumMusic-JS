<template>
  <div class="tm-doc">
    <component v-for="(comp, index) in content" :is="comp.type" :node="comp" :key="index"></component>
  </div>
</template>

<script>
import './document/index'

export default {
  name: 'Document',
  props: {
    content: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>
  .tm-doc {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    color: #24292e;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
  }
  .tm-doc::before {
    display: table;
    content: "";
  }
  .tm-doc::after {
    display: table;
    clear: both;
    content: "";
  }
  .tm-doc>*:first-child {
    margin-top: 0 !important;
  }
  .tm-doc>*:last-child {
    margin-bottom: 0 !important;
  }
  .tm-doc * {
    box-sizing: border-box;
  }

  .tm-doc a {
    background-color: transparent;
    color: #0366d6;
    text-decoration: none;
  }
  .tm-doc a:active {
    outline-width: 0;
  }
  .tm-doc a:hover {
    outline-width: 0;
    text-decoration: underline;
  }
  .tm-doc a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  .tm-doc strong {
    font-weight: 600;
  }

  .tm-doc img {
    border-style: none;
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
  }
  .tm-doc img[align=right] {
    padding-left: 20px;
  }
  .tm-doc img[align=left] {
    padding-right: 20px;
  }

  .tm-doc .anchor {
    float: left;
    padding-right: 4px;
    margin-left: -20px;
    line-height: 1;
  }
  .tm-doc .anchor:focus {
    outline: none;
  }

  .tm-doc code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27,31,35,0.05);
    border-radius: 3px;
  }
</style>
