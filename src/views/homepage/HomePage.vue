<template>
  <div class="hp-fill">
<!--    <h1>HomePage</h1>-->
    <div class="buttons">
      <el-button
          id="sign-in-button"
          color="rgba(133,157,218,0.7)"
          @click="gotoLogin"
          :dark="isDark"
          round
          plain
      >免费试用</el-button>
<!--      <el-button id="register-button" color="#626aef" :dark="isDark" plain @click="gotoRegister">注册</el-button>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "homePage",
  methods: {
    gotoLogin() {
      this.$router.push('/login');
    },
    gotoRegister() {
      this.$router.push('/register');
    }
  }
}
</script>

<style scoped>
.hp-fill {
  background-image: url("../../assets/images/homepage_bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: auto;
  position: fixed;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
}

.buttons button{
  width: 180px;
  height: 50px;
  font-size: 20px;
  box-shadow: 3px 3px 10px #859dda;

}

/*.buttons #register-button{*/
/*  margin: 600px 0 0 100px;*/
/*}*/

.buttons #sign-in-button{
  margin: 600px 0 0 0;
}
</style>