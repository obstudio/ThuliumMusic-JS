<template>
  <div class="footer-player">
    <el-progress :percentage="TimePercentage" class="play-progress"></el-progress>
    <el-container class="play-bar">
      <el-aside width="80px" style="height: 84px" >
        <img src="https://ob-studio.cn/assets/images/icon/obstudio.png" width="80" height="80">
      </el-aside>
      <el-main style="height: 80px">

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
      TimePercentage: 0.75
    }
  }
}
</script>
