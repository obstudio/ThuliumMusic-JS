<template>
  <div class="footer-player">
    <b-progress :value="Time" :max="TotalTime" height="5px" class="progressbar"></b-progress>
    <b-navbar fixed="bottom" type="dark" variant="dark" style="padding: 0rem">
      <b-navbar-brand href="#" style="padding: 0rem">
        <b-img blank blank-color="#66CCFF" width="75" height="75"></b-img>
      </b-navbar-brand>
      <b-nav-item>
        <div>
          <b-progress :value="Time" :max="TotalTime" height="5px"></b-progress>    
        </div>
      </b-nav-item>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'FooterPlayer',
  data () {
    return {
      Time: 75,
      TotalTime: 100
    }
  }
}
</script>

<style scoped>
  .progressbar {
    color: #000AE9; 
    background-color: #6A6A6A;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 75px;
  }
</style>

