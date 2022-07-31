<template>
  <el-container style="padding: 2vh;">
    <el-header style="font-size: 24px">
      测试页头
    </el-header>
    <el-main>
      <el-row gutter="20">
        <el-col :span="4">
          <el-menu
              default-active="1"
          >
            <router-link style="text-decoration: none" to="/">
              <el-menu-item index="1">
                <template #title>
                  <span>Home</span>
                </template>
              </el-menu-item>
            </router-link>

            <router-link style="text-decoration: none" to="/test1">
              <el-menu-item index="2">
                <template #title>
                  <span>Test1</span>
                </template>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-col>
        <el-col :span="20">
          <router-view />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
