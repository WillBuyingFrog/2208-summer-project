<template>
    <div class="project">
        <el-container>
        <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu router
                    :default-active="0"
                    class="el-menu-vertical-demo"
                    background-color="rgba(250, 250, 250, 0.5)"
                    @open="handleOpen"
                    @close="handleClose"
                    style="height:100vh;"
                >  
                    <div class="title">
                        <h4>>>{{}}项目名</h4>
                    </div>
                    <div class="clear"></div> 
                    <el-menu-item index="/projectinfo">
                    <el-icon><Paperclip /></el-icon>
                    <span>项目信息</span>
                    </el-menu-item>                   
                    <el-menu-item index="/projectfile">
                    <el-icon><EditPen /></el-icon>
                    <span>原型设计</span>
                    </el-menu-item>
                    <el-menu-item index="/projectfile">
                    <el-icon><Document /></el-icon>
                    <span>文档编辑</span>
                    </el-menu-item>
                    <el-menu-item index="/projectfile">
                    <el-icon><Picture /></el-icon>
                    <span>绘制图</span>
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
            dialogVisible: false,
            file: {},
            firstChar: "S",//用户名首字母
            proNum: 4,//项目总数
            newone:{
                name: "",
                info: ""
            }
        }
    },
    methods: {
        newTeam(){
            this.dialogVisible = false;
        }
    }

}

</script>

<style scoped>
.project {
  background-image: url("../../assets/images/bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
}
.title{
    float: left;
    margin-left: 25px;
}
.clear{
    clear: both;
}
</style>