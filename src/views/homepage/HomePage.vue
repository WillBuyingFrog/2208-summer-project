<template>
  <div class="hp-fill">
<!--    <h1>HomePage</h1>-->
    <img src="../../assets/images/logo.png" class="logo">
    <div class="buttons">
      <el-button id="sign-in-button" color="#626aef" :dark="isDark" plain @click="gotoLogin">免费试用</el-button>
<!--      <el-button id="register-button" color="#626aef" :dark="isDark" plain @click="gotoRegister">注册</el-button>-->
<!--      <LightComponent></LightComponent>-->
    </div>
  </div>
</template>

<script>
// import LightComponent from "@/views/homepage/LightComponent";
export default {
  name: "homePage",
  // components: {LightComponent},
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
  background-image: url("../../assets/images/1.jpg");
  min-height: 800px;
  overflow: auto;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
}
.logo {
  width: 600px;
  top: 200px;
  color: #80D0C7;
}
.buttons button{
  width: 180px;
  height: 50px;
  font-size: 20px;
  box-shadow: 3px 3px 10px #bebebe;
  border-radius: 5px;
}

.buttons #sign-in-button{
}
</style>