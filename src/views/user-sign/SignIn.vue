<template>
  <div class="login-bg">
    <el-container
        class="login"
        :style="{boxShadow: `var(--el-box-shadow)`}">
      <el-aside class="login-left-pane" width="250px">
        <div class="to-home">
          <p @click="goHome">返回首页</p>
        </div>
      </el-aside>
      <el-main class="login-right-pane">
        <div class="login-fill">
          <div class="login-box">
            <div class="form">
              <el-form :model="form" ref="form" class="demo-ruleForm">
                <el-form-item prop="username">
                  <el-input
                      placeholder="username"
                      type="username"
                      v-model="form.username"
                      autocomplete="off"
                      class="login-input"
                  ></el-input>
                </el-form-item>
                <el-form-item id="password" prop="pass">
                  <el-input
                      placeholder="password"
                      type="password"
                      v-model="form.password"
                      autocomplete="off"
                      @keyup.enter="login"
                      class="login-input"
                  ></el-input>
                </el-form-item>
                <el-form-item class="login-btn">
                  <el-button color="#626aef" :dark="isDark" plain @click="login">登 录</el-button>
                </el-form-item>
              </el-form>
              <div class="to-register">
                <p @click="gotoRegister">去注册></p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.login-bg {
  background-image: url("../../assets/images/sign-bg.jpg");
  background-position:center;
  background-size: 100% auto;
  min-height: 800px;
  overflow: hidden;
}
.login {
  margin: 130px auto auto;
  width: 595px;
  height: 420px;
  border-radius: 20px 20px 20px 20px;
}
.logo-name {
  margin-top: 30px;
  width: 350px;
  height: 175px;
  cursor: pointer;
  overflow: hidden;
}
.login-left-pane {
  background-image: url("../../assets/images/sign-box-bg.jpg");
  background-size: contain;
  background-repeat: repeat-y;
  overflow: revert;
  border-radius: 20px 0px 0px 20px;
}
.login-right-pane {
  padding: 0;
  background-color: rgba(245, 245, 245, 0.84);
  overflow: revert;
  border-radius: 0 20px 20px 0;
}
.login-fill {
  overflow: hidden;
  position: fixed;
}
.login-box {
  width: 295px;
  height: 370px;
  padding: 100px 0 0 50px;
  line-height: 40px;
  position: relative;
  display: inline-block;
}
.login-btn {
  margin-top: 50px;
  text-align: center;
  padding-left: 60px;
}
.login-btn button{
  width: 115px;
  height: 38px;
  box-shadow: 3px 3px 10px #bebebe;
  border-radius: 5px;
}
.login-input {
  width: 230px;
  box-shadow: 3px 3px 10px #bebebe;
  border-radius: 5px;
  margin-top: 20px;
}
.to-home {
  font-size:14px;
  line-height:10px;
  color:#999;
  cursor: pointer;
  float: right;
  margin: 367px 180px 0 0;
  text-shadow: 3px 3px 10px #bebebe;
}
.to-home:hover {
  color: #626aef;
  text-decoration-line: underline;
}
.to-register {
  font-size:14px;
  line-height:10px;
  color:#999;
  cursor: pointer;
  float: right;
  margin: 40px 15px 0 0;
  text-shadow: 3px 3px 10px #bebebe;
}
.to-register:hover {
  color: #626aef;
  text-decoration-line: underline;
}
</style>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
  name: "SignIn",
  data() {
    return {
      is_login: true,
      form: {
        username: '',
        password: '',
      },
    };
  },

  methods: {
    login() {   
      const self = this;
      const formData = new FormData();
      formData.append("username", self.form.username);
      formData.append("passwd", self.form.password);
      if(self.form.username === '')
      ElMessage.warning('请输入用户名')
      else if(self.form.password === '')
      ElMessage.warning('请输入密码')
      // self.$http({
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   method: 'post',
      //   url: '/user/login',
      //   data: JSON.stringify(formData),
      // })
      else{
        this.$http.post("/user/login", {
            username: self.form.username,
            passwd: self.form.password,
          })
          .then(res => {
            console.log(res.data);
            switch (res.data.code) {
              case 200:
                // location.reload();
                // 前端保存用户信息
                this.$store.state.user.id = res.data.data.user_id;
                this.$store.state.user.name = res.data.data.username;
                this.$store.state.user.real_name = res.data.data.real_name;
                this.$store.state.user.email = res.data.data.email;
                this.$store.state.user.info = res.data.data.user_info;
                ElMessage.success('登录成功！');
                setTimeout(() => {
                    this.$router.push('/workspace');
                }, 1000);
                // this.$store.dispatch('saveUserInfo', {user: {
                //     'username': this.form.username,
                //     'confirmed': true,
                //   }});
                // var curr = localStorage.getItem('preRoute');
                // if (curr == null) {
                //   this.$router.push('/workspace');
                // } else {
                //   this.$router.push({ path: curr });
                // }
                break;
              case 500:
                ElMessage.error(res.data.message);
                console.log(res.data.message);
                break;
              case 201:
                ElMessage.warning(res.data.message);
                setTimeout(() => {
                    this.$router.push('/workspace');
                }, 1000);
                break;
              // case 202:
              //   this.$message.error('用户名不存在！');
              //   break;
              // case 203:
              //   this.$message.error('用户名或密码错误！');
              //   break;
              // case 5:
              //   this.$message.warning('用户未通过邮件确认，请及时确认！');
              //   this.$store.dispatch('saveUserInfo', {user: {
              //       'username': this.form.username,
              //       'confirmed': false,
              //     }});
              //   var cur = localStorage.getItem('preRoute');
              //   if (cur == null) {
              //     this.$router.push('/unverified_email');
              //   } else {
              //     this.$router.push({ path: cur });
              //   }
              //   break;
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
      
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    gotoRegister() {
      this.$router.push("/register");
    },
    goHome() {
      this.$router.push('/');
    },
  }
}
</script>
