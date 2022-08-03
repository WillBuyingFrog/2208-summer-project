<template>
  <div
      class="userinfo-box"
      style="display: flex; gap: 16px; flex-direction: column"
  >
    <el-row>
      <el-avatar
          :size="60"
          src="circleUrl"
      />
      <p class="username">UserName</p>
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
        123456789@qq.com
      </p>
    </div>
    <el-divider class="divider"></el-divider>
    <el-popconfirm
        confirm-button-text="Yes"
        cancel-button-text="No, Thanks"
        icon-color="#626AEF"
        title="确认退出登录?"
    >
      <template #reference>
        <el-button class="log-out">退出登录</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script>
export default {
  name: "UserInfo"
}
</script>

<style scoped>
.divider {
  margin: 5px 0 0 0;
}
.username {
  font-size: 28px;
  margin: 13px 0 0px 10px;
}
.email-title {
  font-size: 22px;
  margin: 0px 0 0 10px;
}
.email-content {
  font-size: 18px;
  color: var(--el-color-info);
  margin: 5px 0 0 10px;
}
.log-out {
  font-size: 18px;
  padding: 10px 0;
  height: 20px;
}
</style>