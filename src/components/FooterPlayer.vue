<template>
  <div class="footer-player">
    <el-container class="play-bar">
      <el-aside width="100px" style="height: 104px" >
        <img src="https://ob-studio.cn/assets/images/icon/obstudio.png" width="100" height="100">
      </el-aside>
      <el-main style="height: 100px; padding-top: 0; padding-bottom: 0;">
        <el-row>
          <el-col :span="4" style="color: white; text-align: left; line-height: 1rem; padding-top: .3rem">
            <h1>Ob Studio</h1>
            <p>ObFish</p>
          </el-col>
          <el-col :span="20">
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
                <el-button type="primary" round="true"><icon name="list" scale="1.2"></icon></el-button>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" round="true"><icon name="repeat" scale="1.2"></icon></el-button>
                <el-button type="primary" round="true"><icon name="backward" scale="1.2"></icon></el-button>
                <el-button type="primary" round="true"><icon name="play" scale="1.2"></icon></el-button>
                <el-button type="primary" round="true"><icon name="forward" scale="1.2"></icon></el-button>
                <el-button type="primary" round="true"><icon name="random" scale="1.2"></icon></el-button>
              </el-col>
              <el-col :span="4" style="padding-right: 1rem">
                <el-row>
                  <el-col :span="6">
                    <icon name="volume-up" scale="1.5" style="color: white; padding-top: 0.5rem;"></icon>
                  </el-col>
                  <el-col :span="18">
                    <el-slider v-model="volume"></el-slider>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
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
  .el-button {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: .6rem;
    padding-bottom: .6rem;
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
