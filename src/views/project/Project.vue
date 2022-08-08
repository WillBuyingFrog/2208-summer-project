<template>
    <div class="project">
        <el-container>
        <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu router
                    :default-active="activePath"
                    class="menu"
                    @open="handleOpen"
                    @close="handleClose"
                    style="height:100vh;"
                >  
                    <div class="title">
                        <h4>>>{{this.$store.state.project_name}}</h4>
                    </div>
                    <div class="clear"></div> 
                    <el-menu-item index="/projectinfo">
                    <el-icon><Paperclip /></el-icon>
                    <span>项目信息</span>
                    </el-menu-item>                   
                    <el-menu-item index="/projectfile?filetype=1">
                    <el-icon><EditPen /></el-icon>
                    <span>原型设计</span>
                    </el-menu-item>
                    <el-menu-item index="/projectfile?filetype=0">
                    <el-icon><Document /></el-icon>
                    <span>文档编辑</span>
                    </el-menu-item>
                    <el-menu-item index="/projectfile?filetype=2">
                      <a href="https://app.diagrams.net" target="_blank" class="uml-link">
                        <el-icon><Picture /></el-icon>
                        <span>绘制图</span>
                      </a >
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
        </el-container>
        
    </div>
</template>

<script>

export default {
    name: "oneProject",
    data() {
        return {
            fileType: "1",
        }
    },
    computed:{
        activePath(){   
        return this.$route.fullPath;
        }
  },
    created(){

    },
    methods: {
    }

}

</script>

<style scoped>
.menu {
  /*background-color: rgba(179, 186, 197, 0.5);*/
  /*background-color: rgba(101, 106, 129, 0.3);*/
  background-color: rgba(250, 250, 250, 0.6);

  /*background-color: rgba(133, 137, 218, 0.3);*/
}
.project {
  background-image: url("../../assets/images/bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
}
.project .el-menu-item.is-active{
  color: #859dda;
}
.title{
    float: left;
    margin-left: 25px;
}
.clear{
    clear: both;
}
.uml-link {
  text-decoration-line: none;
  COLOR: #000000; 
}
</style>