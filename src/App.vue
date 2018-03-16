<template>
  <div id="app" class="full-screen">
    <router-view/>
    <footer-player style="text-align: center;"/>
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
  color: #2c3e50;
}

.full-screen {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
}
</style>
