<template>
  <div
      class="userinfo-box"
      style="display: flex; gap: 16px; flex-direction: column"
  >
    <el-row>
      <el-avatar
          :size="50"
          :style="{background:avatarColor}">
          {{this.$store.state.user.name.slice(0,1)}} 
      </el-avatar>
      <p class="username">{{this.$store.state.user.name}}</p>
    </el-row>
    <el-divider class="divider"></el-divider>
    <div>
      <p
          class="email-title"
      >
        Email
      </p>
      <p
          class="email-content"
      >
        {{this.$store.state.user.email}}
      </p>
    </div>
    <el-divider class="divider"></el-divider>
    <el-popconfirm
        confirm-button-text="Yes"
        cancel-button-text="No, Thanks"
        icon-color="#626AEF"
        title="确认退出登录?"
        @confirm="logout()">
      <template #reference>
        <el-button class="log-out" >退出登录</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
  name: "UserInfo",
  props:['avatarColor'],
  created(){
  },
  methods: {
    logout(){
      const self = this;
      self.$http({
        method:'post',
        url:'/user/logout'})
        .then(res=>{
        console.log(res.data);
        if(res.data.code == '200'){
          ElMessage.success('退出登录成功');
          this.$store.state.user={};
          setTimeout(() => {
          this.$router.push('/')
        }, 1000);
        }
      })
      
      
    }
  },
}
</script>

<style scoped>
.divider {
  margin: 5px 0 0 0;
}
.username {
  font-size: 22px;
  margin: 8px 0 0px 10px;
}
.email-title {
  font-size: 22px;
  margin: 0px 0 0 10px;
}
.email-content {
  font-size: 18px;
  color: var(--el-color-info);
  margin: 10px 0 0 10px;
}
.log-out {
  font-size: 18px;
  padding: 15px 0;
  height: 20px;
}
</style>