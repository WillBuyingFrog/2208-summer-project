<template>
  <div class="register-bg">
    <el-container
        class="register"
        :style="{boxShadow: `var(--el-box-shadow)`}">
      <el-aside class="register-left-pane" width="250px">
        <div class="to-home">
          <p @click="goHome">返回首页</p>
        </div>
      </el-aside>
      <el-main class="register-right-pane">
        <div class="register-fill">
          <div class="register-box">
            <div class="form">
              <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <el-form-item prop="username">
                  <el-input
                      placeholder="username"
                      type="username"
                      v-model="ruleForm.username"
                      autocomplete="off"
                      @keyup.enter="register('ruleForm')"
                      class="register-input"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="realName">
                  <el-input
                      placeholder="real name"
                      type="realName"
                      v-model="ruleForm.realName"
                      autocomplete="off"
                      @keyup.enter="register('ruleForm')"
                      class="register-input"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="pass">
                  <el-input
                      placeholder="password"
                      type="password"
                      v-model="ruleForm.pass"
                      autocomplete="off"
                      @keyup.enter="register('ruleForm')"
                      class="register-input"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                  <el-input
                      placeholder="confirm password"
                      type="password"
                      v-model="ruleForm.checkPass"
                      autocomplete="off"
                      @keyup.enter="register('ruleForm')"
                      class="register-input"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <el-input
                      placeholder="email"
                      type="email"
                      v-model="ruleForm.email"
                      autocomplete="off"
                      @keyup.enter="register('ruleForm')"
                      class="register-input"
                  ></el-input>
                </el-form-item>
                <el-form-item class="register-btn">
                  <el-button color="#626aef" :dark="isDark" plain @click="register('ruleForm')">注 册</el-button>
                </el-form-item>
              </el-form>
              <div class="to-login">
                <p @click="gotoLogin">去登录></p>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<style scoped>
.register-bg {
  background-image: url("../../assets/images/sign-bg.jpg");
  background-position:center;
  background-size: 100% auto;
  min-height: 800px;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
}
.register {
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
.register-left-pane {
  background-image: url("../../assets/images/sign-box-bg.jpg");
  background-size: contain;
  background-repeat: repeat-y;
  overflow: revert;
  border-radius: 20px 0px 0px 20px;
}
.register-right-pane {
  padding: 0;
  background-color: rgba(245, 245, 245, 0.84);
  overflow: revert;
  border-radius: 0 20px 20px 0;
}
.register-fill {
  overflow: hidden;
  position: fixed;
}
.register-box {
  width: 295px;
  height: 370px;
  padding: 50px 0 0 50px;
  line-height: 40px;
  position: relative;
  display: inline-block;
}
.register-btn {
  margin-top: 25px;
  text-align: center;
  padding-left: 60px;
}
.register-btn button{
  width: 115px;
  height: 38px;
  box-shadow: 3px 3px 10px #bebebe;
  border-radius: 5px;
}
.register-input {
  width: 230px;
  box-shadow: 3px 3px 10px #bebebe;
  border-radius: 5px;
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
.to-login {
  font-size:14px;
  line-height:10px;
  color:#999;
  cursor: pointer;
  float: right;
  margin: 5px 15px 0 0;
  text-shadow: 3px 3px 10px #bebebe;
}
.to-login:hover {
  color: #626aef;
  text-decoration-line: underline;
}
</style>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
  name: "SignUp",
  data() {
    var checkUsername = (rule, value, callback) => {
      const reg=/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (!value) {
        return callback(new Error('用户名为必填项'));
      } else if (!reg.test(value)) {
        callback(new Error('用户名由中英文、数字或下划线组成'))
      } else {
        callback();
      }
    };
    var checkRealName = (rule, value, callback) => {
      const reg=/^[\u4e00-\u9fa5_a-zA-Z]+$/;
      if (!value) {
        return callback(new Error('真实姓名为必填项'));
      } else if (!reg.test(value)) {
        callback(new Error('请输入真实姓名'))
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱为必填项'));
      } else {
        var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入有效邮箱'));
        } else {
          callback();
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        var reg_pwd=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
        if (!reg_pwd.test(value)) {
          callback(new Error('密码应包含字母和数字，且长度为8-18个字符'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: '',
        realName: '',
        email: '',
        pass: '',
        checkPass: '',
      },
      rules: {
        username: [
          { validator: checkUsername, trigger: 'blur'}
        ],
        realName: [
          { validator: checkRealName, trigger: 'blur'}
        ],
        email: [
          { validator: checkEmail, trigger: 'blur'}
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    register: function (formName) {
      const self = this;
      const formData = new FormData();
      formData.append("username", self.ruleForm.username);
      formData.append("realName", self.ruleForm.realName);
      formData.append("email", self.ruleForm.email);
      formData.append("password1", self.ruleForm.pass);
      formData.append("password2", self.ruleForm.checkPass);

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
              .post("/user/register", {
                username: self.ruleForm.username,
                passwd: self.ruleForm.pass,
                email: self.ruleForm.email,
                real_name: self.ruleForm.realName,
                user_info: '',
              })
          // self.$http({
          //   method: 'post',
          //   url: '/user/register',
          //   data: formData,
          // })
              .then(res => {
                console.log(res.data)
                switch (res.data.code) {
                  case 200:
                    this.$store.dispatch('saveUserInfo', {user: {
                        'username': this.ruleForm.username,
                        'confirmed': false,
                      }});
                    ElMessage.success('注册成功！');
                    setTimeout(() => {
                      this.$router.push('/login')
                    }, 1000);
                    break;
                  // case -1:
                  //   this.$message.warning('请检查填写的内容');
                  //   break;
                  case 500:
                    ElMessage.error(res.data.message);
                  break;
                  // case 3:
                  //   this.$message.error('邮箱已注册或不可用');
                  //   break;
                  // case 4:
                  //   this.$message.error('密码不符合规范');
                  //   break;
                  // case 4:
                  //   this.$message.error('两次输入的密码不一致！');
                  //   break;
                  // case 6:
                  //   this.$message.error('邮件验证码发送失败，请检查邮箱是否填写正确！');
                  //   break;
                }
              })
              .catch(err => {
                console.log(err);
              })
        } else {
          console.log('提交失败!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    gotoLogin() {
      this.$router.push("/login");
    },
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>
