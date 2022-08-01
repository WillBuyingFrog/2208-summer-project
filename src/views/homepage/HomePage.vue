<template>
  <div class="hp-fill">
    <h1>HomePage</h1>
    <div class="buttons">
      <el-button id="register-button" color="#626aef" :dark="isDark" plain>Try Out Now</el-button>
      <el-button id="sign-in-button" color="#626aef" :dark="isDark" plain>Sign In</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "homePage"
}
</script>

<style scoped>
.hp-fill {
  background-image: url("../../assets/images/homepage_bk.png");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
}

.buttons button{
  width: 180px;
  height: 50px;
  font-size: 20px;
}

.buttons #register-button{
  margin: 500px 100px 0 0;
}

.buttons #sign-in-button{
  margin: 500px 0px 0 100px;
}
</style>