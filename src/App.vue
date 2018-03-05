<template>
  <div id="app">
    <router-view/>
    <footer-player/>
  </div>
</template>

<script>
import FooterPlayer from './components/FooterPlayer'
export default {
  name: 'App',
  components: {
    FooterPlayer
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
