<template>
  <div class="hp-fill">
<!--    <h1>HomePage</h1>-->
    <div class="buttons">
      <el-button id="register-button" color="#626aef" :dark="isDark" plain @click="gotoRegister">Try Out Now</el-button>
      <el-button id="sign-in-button" color="#626aef" :dark="isDark" plain @click="gotoLogin">Sign In</el-button>
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
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
}

.buttons button{
  width: 180px;
  height: 50px;
  font-size: 20px;
  box-shadow: 3px 3px 10px #bebebe;
  border-radius: 5px;
}

.buttons #register-button{
  margin: 600px 100px 0 0;
}

.buttons #sign-in-button{
  margin: 600px 0 0 100px;
}
</style>