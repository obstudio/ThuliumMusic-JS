<template>
  <div class="footer-player">
    <b-progress :value="Time" :max="TotalTime" height="5px" class="ProgressBar rounded-0"></b-progress>
    <b-navbar fixed="bottom" type="dark" variant="dark" style="padding: 0rem; height: 75px;">
      <b-navbar-brand href="#" style="padding: 0rem">
        <b-img blank blank-color="#66CCFF" width="75" height="75"></b-img>
      </b-navbar-brand>
    </b-navbar>
    <b-row class="MusicInfoCtrl">
      <b-col class="MusicInfo">
          <h4>OBFISH</h4>
          <p>Ob</p>
      </b-col>
      <b-col cols="3">
        <b-row>
          <b-col>
            <b-button>Pre</b-button>
          </b-col>
          <b-col>
            <b-button>Play</b-button>
          </b-col>
          <b-col>
            <b-button>Next</b-button>
          </b-col>
          <b-col></b-col>
        </b-row>
      </b-col>
    </b-row>
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
  .ProgressBar {
    color: #000AE9;
    background-color: #6A6A6A;
    position: fixed;
    right: 0;
    left: 75px;
    bottom: 70px;
    z-index: 20000;
  }
  .MusicInfoCtrl {
    position: fixed;
    right: 20px;
    left: 100px;
    bottom: 0;
    z-index: 10000
  }
  .MusicInfo {
    text-align: left;
    color: white;
    line-height: 1rem;
  }
</style>
