<template>
<div class="prototype-bg">
<div class="bg-plus">
  <el-container class="outer-container">
    <el-header height="60px" class="header">
      <el-row>
        <el-col>
          <el-popconfirm
              confirm-button-text="Yes"
              cancel-button-text="No, Thanks"
              icon-color="#626AEF"
              title="确认退出编辑?"
              class="quit"
              @confirm="quit()"
          >
            <template #reference>
              <div class="logo">
                <img src="../../assets/images/logo-1.png" height="60">
              </div>
            </template>
          </el-popconfirm>
        </el-col>
        <el-col>
          <p class="name">文档标题</p>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="inner-container">
      <el-main class="mainPane">
        <div class="editor">
          <DesignApp class="editor"></DesignApp>
        </div>
      </el-main>
    </el-container>
  </el-container>
</div>
</div>
</template>

<script>
//import { InfoFilled } from '@element-plus/icons-vue';

import {ElMessage} from "element-plus";
import DesignApp from "@/views/prototype-design/DesignApp";
export default {
  name: "PrototypeDesign",
  components: {DesignApp},
  methods: {
    quit() {
      ElMessage.success('即将回到工作空间');
      setTimeout(() => {
        this.$router.push('/workspace')
      }, 1000);
    }
  }
}
</script>

<style scoped>
.prototype-bg {
  background-image: url("../../assets/images/sign-bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
}
.bg-plus {
  background-color: rgba(255, 255, 255, 0.50);
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
}
.outer-container {
  height: 800px;
}
.inner-container {
  padding: 10px 0 20px 0;
  margin: 0 20px 0 20px;

}
.header {
  margin: 0 20px 0 20px;
  border-radius: 0 0 10px 10px;
  background-color: rgba(255, 255, 255, 0.30);
  overflow: hidden;
  box-shadow: 3px 3px 10px #bebebe;

}
.logo {
  position: absolute;
}
.name {
  position: center;
  font-size: 20px;
  margin-top: 15px;
}
.icon {
  margin: 0 0 10px 0;
}
.mainPane {
  margin: 0 0 0 10px;
  padding: 0;
}
.editor {
  width: 1380px;
}
</style>