<template>
  <div class="allproject">
    <el-container>
      <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
      <el-main>
        <el-tabs v-model="status" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="所有项目" name="0"></el-tab-pane>
            <el-tab-pane label="回收站" name="1">
                <el-popconfirm title="确定要清空回收站?" @confirm="cleanTrash" v-if="allproject.length!=0">
                    <template #reference>
                        <el-button type="danger">清空回收站</el-button>   
                    </template>
                </el-popconfirm>
            </el-tab-pane>
        </el-tabs>
        <el-space wrap size="large">
            <el-card :key="i" class="box-card" style="width: 300px" v-if="status==0">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            新建项目
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="new">
                    <el-button @click="dialogVisible=true">
                        <div><Plus style="width: 1em; height: 1em;"/></div>
                    </el-button>
                </div>
                <div class="hint">快来创建新项目吧！</div>
            </el-card>
            <el-card :key="i" class="box-card" style="width:300px;height: 310px;" v-if="status==1 && allproject.length==0">
                  <el-empty description="回收站无项目" />
            </el-card>
            <el-card v-for="project in allproject" :key="project.project_id" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            {{project.project_name}}
                        </span>
                    <el-button class="button" type="primary" plain v-if="status==0" @click="toProject(project.project_name, project.project_id)">进入项目</el-button>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="textitem">
                    <el-form :model="project" label-width="120px" label-position="left">
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><Avatar /></el-icon> 创建者:</div>
                            </template>
                            <span class="show">{{project.creator}}</span>
                        </el-form-item>
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                            </template>
                            <span class="show">{{project.create_time}}</span>
                        </el-form-item>      
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><CollectionTag /></el-icon> 项目简介:</div>
                            </template>
                            <span class="show">{{project.project_info}}</span>
                        </el-form-item>
                        <div class="button1" v-if="status == 0">
                            <el-button type="primary" @click="openRename(project.project_name)">重命名</el-button>
                            <el-popconfirm title="确定要删除此项目?" @confirm="deletePro(project.project_name)">
                                <template #reference>
                                <el-button type="danger">删&nbsp;除</el-button> 
                                </template>
                            </el-popconfirm>
                        </div>  
                        <div class="button1" v-if="status == 1">
                            <el-popconfirm title="确定要恢复此项目?" @confirm="recover(project.project_name)">
                                <template #reference>
                                    <el-button type="danger" >恢&nbsp;复</el-button>     
                                </template>
                            </el-popconfirm>
                        </div>                                      
                    </el-form>
                </div>
            </el-card>
            <div class="clear"></div>
        </el-space>
      </el-main>
    </el-container>
    <el-dialog
        v-model="dialogVisible"
        width="35%">
        <template #header>
                    <div class="card-header">
                        <span class="title" style="margin-left: 10px; color: black">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            新建项目
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
        <el-form :model="newone" label-width="80px">
            <el-form-item label="项目名称">
                <el-input v-model="newone.name"></el-input>
            </el-form-item>
            <el-form-item label="项目简介">
                <el-input type="textarea" maxlength="200" show-word-limit
                    resize="none" :autosize="{ minRows: 6}" v-model="newone.info" style="width:400px"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newProject">立即创建</el-button>
        </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="dialogVisible1"
        width="35%">
        <template #header>
                    <div class="card-header">
                        <span class="title" style="margin-left: 10px; color: black">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            重命名项目
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
        <el-form :model="newone" label-width="100px">
            <el-form-item label="项目新名称">
                <el-input v-model="newname"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取消</el-button>
            <el-button type="primary" @click="rename">确定</el-button>
        </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
    name: "allProject",
    data() {
        return {
            team_id: '',
            dialogVisible: false,
            dialogVisible1: false,
            status: "0",
            allproject: [],
            // allproject: [{
            //     project_id: '1',
            //     project_name: '1',
            //     team_name: '1',
            //     creator_name: '1',
            //     create_time: '1',
            //     last_modification_user: '1',
            //     last_modification_time: '1',
            //     project_info: '1'
            // }],
            newname: '',
            oldname: '',
            newone:{
                name: "",
                info: ""
            }
        }
    },
    created(){
        this.team_id = this.$store.state.team_id;
        this.getAllProject();
        console.log("team_id: "+this.team_id);
    },
    methods: {
        getAllProject(){
            this.$axios
            .post('/project/viewAllProject',{
                        team_id: this.team_id
                    })
                .then(res =>{
                    console.log(res.data);
                    switch(res.data.code) {
                        case 200:
                            this.allproject = res.data.data;
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        },
        getTrashProject() {
            this.$axios
                .post("/project/viewTrash", {
                    team_id: this.team_id
                })
                .then(res =>{
                    console.log(res.data);
                    switch(res.data.code) {
                        case 200:
                            this.allproject = res.data.data;
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        handleClick() {
            this.allproject=[];
            console.log(this.status);
            if(this.status == '1'){
                this.getAllProject();
                console.log('allproject');
            }
            else if(this.status == '0'){
                this.getTrashProject();
                console.log('trashproject');
            }
        },
        newProject(){         
            if(this.newone.name == '' || this.newone.name == undefined || this.newone.name == null) {
                ElMessage.warning("请输入项目名称");
            }
            else{
                this.$axios
                .post('/project/new',{
                    project_name: this.newone.name,
                    team_id: this.team_id,
                    project_info: this.newone.info
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            this.getAllProject();
                            ElMessage.success("创建成功!");
                            this.newone.name = '';
                            this.newone.info = '';
                            this.dialogVisible = false;
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
        openRename(oldname){
            this.oldname = oldname;
            this.dialogVisible1 = true;
        },
        rename(){
            if(this.newname == '' || this.newname == null || this.newname == undefined){
                ElMessage.warning("重命名不能为空")
            }else{
                this.$http
                .post('/project/rename', {
                    team_id: this.team_id,
                    original_project_name: this.oldname,
                    new_project_name: this.newname
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            this.getAllProject();
                            ElMessage.success("重命名成功!");
                            this.newname = '';
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
        deletePro(project_name){
            this.$http
                .post('/project/remove', {
                    project_name: project_name,
                    team_id: this.team_id
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            this.getAllProject();
                            ElMessage.success(res.data.message);
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
        recover(project_name){
            this.$http
                .post('/project/recover', {
                    project_name: project_name,
                    team_id: this.team_id
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            this.getTrashProject();
                            ElMessage.success(res.data.message);
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
        cleanTrash(){
            this.$http
                .post('/project/emptyTrash', {
                    team_id: this.team_id
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            this.getTrashProject();
                            ElMessage.success(res.data.message);
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
        toProject(name, id){
            this.$store.state.project_name = name;
            this.$store.state.project_id = id;
            this.$router.push('/projectinfo');
        }
    },
}

</script>

<style scoped>
.allproject {
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

.el-tabs{
    width: 150px;
    margin-left: 50px;
}
.logo {
    padding-top: 15px;
    padding-left: 10px;
}
.el-space {
    float: left;
    padding-left: 12%;
}
.el-card {
    margin: 30px 30px 0 30px;
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
}
.el-card .el-form{
    margin-left: 10px;
}
.el-dialog .el-form{
    margin-left:50px;
    margin-right: 100px;
}
.dialog-footer {
    float: calc();
}
.button1 .el-button{
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 20px;
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
.head{
    border-radius: 100%;
    background-color:  rgb(64,158,255);
    width: 40px;
    height: 40px;
    margin: 15px;
    font-size: 35px;
    color: white;
    text-align: center;
    margin-right: 30px;
}
.headleft{
    float: right;
}
.label1{
    font-size: 16px;
}
.clear{
    clear: both;
}
.textitem .show{
  text-align: left;
  width: 100%;   /*一定要设置宽度，或者元素内含的百分比*/
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}
.pname{
    font-size: 25px;
    float: left;
    font-weight: 600;
    width: 150px;
    text-align: left;
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}
.button{
    float: right;
}
.new .el-button{
    margin-top: 25px;
    margin-bottom: 37px;
    height: 100px;
    width: 100px;
}

.hint{
    margin-bottom: 20px;
}
</style>
