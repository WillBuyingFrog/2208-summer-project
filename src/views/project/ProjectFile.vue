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
            <el-button type="primary" @click="newFile">立即创建</el-button>
        </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="dialogVisible1"
        width="35%">
        <template #header>
                    <div class="card-header">
                        <span class="title" v-if="fileType == 1" style="margin-left: 10px; color: black">
                            <el-icon ><EditPen /></el-icon>重命名原型
                        </span>
                        <span class="title" v-if="fileType == 0" style="margin-left: 10px; color: black">
                            <el-icon><Document /></el-icon>重命名文档
                        </span>
                        <span class="title" v-if="fileType == 2" style="margin-left: 10px; color: black">
                            <el-icon><Picture /></el-icon>重命名图
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
        <el-form :model="newone" label-width="100px">
            <el-form-item label="新的文件名">
                <el-input v-model="newName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取消</el-button>
            <el-button type="primary" @click="renameFile">确定</el-button>
        </span>
        </template>
    </el-dialog>
    <el-space direction="vertical">
            <el-card v-for="file in allFile" :key="file.file_id" class="box-card" style="width: 900px">
                <div class="card-header">
                    <span class="pname">
                        <el-icon v-if="fileType == 1"><EditPen /></el-icon>
                        <el-icon v-if="fileType == 0"><Document /></el-icon>
                        <el-icon v-if="fileType == 2"><Picture /></el-icon>
                        {{file.file_name}}
                    </span>
                    <el-button size="small" type="primary" @click="editFile(file.file_id, file.file_name)">编辑</el-button>
                    <el-button size="small" type="primary" plain @click="openRename(file.file_id)">重命名</el-button>
                    <el-popconfirm title="确定要删除此文件?" @confirm="deleteFile(file.file_id)">
                        <template #reference>
                        <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
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
                                <span>{{file.creator}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                                </template>
                                <span>{{file.create_time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><User /></el-icon> 最后编辑者:</div>
                                </template>
                                <span>{{file.last_modification_user}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span>{{file.last_modification_time}}</span>
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
            dialogVisible1: false,
            allFile: [],
            newFileid: '',
            newName: '',
            nowfid: '',
            newone:{
                name: "",
            }
        }
    },
    watch:{
        //查询参数改变，再次执行数据获取方法
        '$route'(){
            this.fileType = this.$route.query.filetype;
            this.allFile = {};
            this.getFile();
        }
    },
    created(){
        this.team_id = this.$store.state.team_id;
        this.project_name = this.$store.state.project_name;
        this.project_id = this.$store.state.project_id;
        console.log(this.fileType);
        this.getFile();
    },
    methods: {
        getFile(){
            this.$http
                .post('/file/viewType', {
                    project_id: this.project_id,
                    type: this.fileType
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.allFile = res.data.data;
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
            //设计原型、文档
            else if(this.fileType == 1 || this.fileType == 0){
                this.$http
                .post('/file/json/new', {
                    project_id: this.project_id,
                    file_name: this.newone.name,
                    type: this.fileType
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("创建成功！")
                            this.newone.name = '';
                            this.newFileid = res.data.data;
                            this.dialogVisible = false;
                            //是否跳转到编辑页？
                            // this.$router.push('/prototypeDesign');
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
            //原型设计,文档
            if(this.fileType == 1 || this.fileType == 0){
                this.$http({
                    method:'post',
                    url:'/file/json/delete',
                    params: {
                        file_id: fileid,
                    },
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("删除成功！")
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
            //绘制图
            else if(this.fileType == 2){
                this.$http({
                    method:'post',
                    url:'/file/json/delete',
                    params: {
                        file_id: fileid,
                    },
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("删除成功！")
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
        openRename(fileid){
            this.dialogVisible1 = true;
            this.nowfid = fileid;
            console.log(this.nowfid);
        },
        renameFile(){
            if(this.fileType == 1 || this.fileType == 0){
                this.$http({
                    method:'post',
                    url:'/file/json/update',
                    params: {
                        file_id: this.nowfid,
                        file_name: this.newName
                    },
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("重命名成功！")
                            this.newName = '';
                            this.dialogVisible1 = false;
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
        editFile(id, name){
            this.$store.state.file_name = name;
            this.$store.state.file_id = id;
            console.log(this.$store.state.file_id);
            if(this.fileType == 1){
                let routeUrl = this.$router.resolve({
                    path: "/prototypeDesign",
                });
                window.open(routeUrl.href, "_blank");
                //this.$router.push('/prototypeDesign');
            }
            else if(this.fileType == 0){
                let routeUrl = this.$router.resolve({
                    path: "/documentEdit",
                });
                window.open(routeUrl.href, "_blank");
                //this.$router.push('/documentEdit');
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
    font-size: 20px;
    color: #859dda;
    border-bottom:4px solid  #859dda;
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
