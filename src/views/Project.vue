<template>
    <div class="project">
        <el-container>
        <el-header>Header</el-header>
        <el-container>
            <el-aside width="200px">
        <h5 class="mb-2">Default colors</h5>
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >
            <el-menu-item index="1">
            <el-icon><icon-menu /></el-icon>
            <span>原型设计</span>
            </el-menu-item>
            <el-menu-item index="2">
            <el-icon><document /></el-icon>
            <span>文档编辑</span>
            </el-menu-item>
            <el-menu-item index="3">
            <el-icon><Picture /></el-icon>
            <span>绘制图</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
            <el-main>Main</el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>

export default {
    name: "oneProject",
    data() {
        return {
            dialogVisible: false,
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
.project .el-header{
    height: 60px;
}
</style>