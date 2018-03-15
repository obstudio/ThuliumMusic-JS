<template>
  <div class="footer-player">
    <el-container class="play-bar">
      <el-aside width="100px" style="height: 104px" >
        <img src="https://ob-studio.cn/assets/images/icon/obstudio.png" width="100" height="100">
      </el-aside>
      <el-main style="height: 100px; padding-top: 0;">
        <el-row>
          <el-col :span="2" style="padding-top: .6rem; color: white">
            01:15
          </el-col>
          <el-col :span="20">
            <el-slider v-model="Time" step="1" :max="TotalTime"></el-slider>
          </el-col>
          <el-col :span="2" style="padding-top: .6rem; color: white">
            01:40
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="4">
            <el-button type="primary" round="true">PlayList</el-button>
          </el-col>
          <el-col :span="16">
            <el-button type="primary" round="true">Repeat</el-button>
            <el-button type="primary" round="true">Pre</el-button>
            <el-button type="primary" round="true">Play/Paulse</el-button>
            <el-button type="primary" round="true">Next</el-button>
            <el-button type="primary" round="true">Random</el-button>
          </el-col>
          <el-col :span="4">
            <el-slider v-model="volume"></el-slider>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
  .play-bar {
    position: fixed;
    right: 0;
    left: 0;
    bottom: -4px;
    background-color: #282828;
  }
  .play-progress {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 75px;
    z-index: 1024;
    padding: 0;
  }
  .el-aside {
    padding: 0;
  }
</style>

<script>
export default {
  name: 'FooterPlayer',
  data () {
    return {
      Time: 75,
      TotalTime: 100,
      volume: 75
    }
  }
}
</script>
