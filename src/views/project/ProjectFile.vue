<template>
    <div>
    <div class="newfile"><el-button type="primary" @click="dialogVisible = true">+新建</el-button></div>
    <div class="clear"></div>
    <el-dialog
        v-model="dialogVisible"
        width="35%">
        <template #header>
                    <div class="card-header">
                        <span class="title" v-if="fileType == 1" style="margin-left: 10px; color: black">
                            <el-icon ><EditPen /></el-icon>新建原型                           
                        </span>
                        <span class="title" v-if="fileType == 0" style="margin-left: 10px; color: black">
                            <el-icon><Document /></el-icon>新建文档                           
                        </span>
                        <span class="title" v-if="fileType == 2" style="margin-left: 10px; color: black">
                            <el-icon><Picture /></el-icon>新建图                           
                        </span> 
                    <div class="clear"></div>
                    </div>
                </template>
        <el-form :model="newone" label-width="80px">
            <el-form-item label="文件名称">
                <el-input v-model="newone.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newProject">立即创建</el-button>
        </span>
        </template>
    </el-dialog>
    <el-space direction="vertical">
            <el-card v-for="i in proNum" :key="i" class="box-card" style="width: 900px">
                <div class="card-header">
                    <span class="pname">
                        <el-icon v-if="fileType == 1"><EditPen /></el-icon>
                        <el-icon v-if="fileType == 0"><Document /></el-icon>
                        <el-icon v-if="fileType == 2"><Picture /></el-icon>
                        {{}}文件名
                    </span>
                    <el-button size="small" type="primary">编辑</el-button>
                    <el-button size="small" type="primary" plain>重命名</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                    <div class="clear"></div>
                <el-button class="button" type="primary" plain v-if="status==0">进入项目</el-button>
                <div class="clear"></div>
                </div>
            <div class="text item">
                <el-form :model="file" label-width="140px" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Avatar /></el-icon> 创建者:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span>2022/08/02 21:46{{}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><User /></el-icon> 最后编辑者:</div>
                                </template>
                                <span>{{}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>                                    
                </el-form>
            </div>
        </el-card>
    </el-space>
    </div>
</template>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
    name: "projectFile",
    data() {
        return {
            team_id: '',
            project_name: '',
            project_id: '',
            fileType: "1",
            dialogVisible: false,
            allFile: [],
            newFileid: '',
            newone:{
                name: "",
            }
        }
    },
    created(){
        this.team_id = this.$store.state.teamid;
        this.project_name = this.$store.state.project_name;
        this.project_id = this.$store.state.project_id;
        this.fileType = this.$route.query.filetype;
        console.log(this.fileType);
    },
    methods: {
        getFile(){
            this.$http
                .post('/project/viewProject', {
                    project_name: this.project_name,
                    team_id: this.team_id
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.project = res.data.data;
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                            break;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        newFile(){
            if(this.newone.name == '' || this.newone.name == null || this.newone.name == undefined){
                ElMessage.warning("请输入文件名");
            }
            //设计原型
            else if(this.fileType == 1){
                this.$http
                .post('/file/json/new', {
                    project_id: this.project_id,
                    file_name: this.newone.name,
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            ElMessage.success("创建成功！")
                            this.newFileid = res.data.data;
                            //是否跳转到编辑页？
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                            break;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        },
        deleteFile(fileid){
            if(this.fileType == 1){
                this.$http
                .post('/file/json/delete', {
                    file_id: fileid,
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            ElMessage.success("删除成功！")
                            this.getFile();
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                            break;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        },
        renameFile(fileid){
            if(this.fileType == 1){
                this.$http
                .post('/file/json/delete', {
                    file_id: fileid,
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            ElMessage.success("删除成功！")
                            this.getFile();
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                            break;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    }

}

</script>

<style scoped>
.newfile {
    float: left;
    margin-left: 10%;
}
.el-space {
    margin-left: 10%;
    margin-right: 5%;
}
.title{
    width: 120px;
    margin-left: 50px;
    margin-top: 20px;
    padding-bottom: 5px;
    font-size: 22px;
    color: rgb(64,158,255);
    border-bottom:4px solid  rgb(64,158,255);
    font-weight: 600;
    float: left;
    }
.el-card {
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
    margin-top:20px;
}
.el-form {
    padding-left: 20px;
    padding-right: 20px;
    padding-top:5px
}
.el-row{
    height: 30px;
}
.pname{
    font-size: 18px;
    float: left;
    font-weight: 520;
}
.clear{
    clear: both;
}
.card-header .el-button{
    float: right;
    margin-right: 20px;
}
.card-header{
    border-bottom: 1px solid #D3D3D3;
    padding-bottom: 6px;
}
</style>