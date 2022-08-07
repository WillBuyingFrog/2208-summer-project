<template>
  <div class="allproject">
    <el-container>
      <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
        <el-container>
        <el-aside width="150px">
            <el-tabs v-model="status" class="demo-tabs" tab-position="left" style="margin-top:30px">
            <el-tab-pane name="0">
                <template #label>
                    <div class="tab">所有项目</div>
                </template>
            </el-tab-pane>
            <el-tab-pane name="1">   
                <template #label>
                    <div class="tab">收藏项目</div>
                </template>
            </el-tab-pane>
            <el-tab-pane name="2">   
                <template #label>
                    <div class="tab">回收站</div>
                </template>            
            </el-tab-pane>
        </el-tabs>
        </el-aside>
      <el-main>
        <el-row v-if="status==2 && allproject.length!=0">
        <div class="del" style="margin-left:30px;margin-bottom:20px">
        <el-popconfirm title="确定要清空回收站?" @confirm="cleanTrash">
            <template #reference>
                <el-button type="danger">清空回收站</el-button>   
            </template>
        </el-popconfirm>
        </div>
        </el-row>
        <el-row v-if="allproject.length!=0">
            <div class="search">
            <el-input v-model="search" placeholder="请输入项目名关键字" size="large">
                <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                </template>
            </el-input>
            <span class="button2"><el-button color="#82b38c">搜索</el-button></span>
            </div>
        </el-row>
        <el-row v-if="allproject.length!=0">
            <div style="margin-left: 30px;margin-top:20px">
                <el-radio-group v-model="orderType">
                    <el-radio :label="1">项目名</el-radio>
                    <el-radio :label="2">创建时间(降序)</el-radio>
                    <el-radio :label="3">创建时间(升序)</el-radio>
                    <el-radio :label="4">最后编辑时间(降序)</el-radio>
                    <el-radio :label="5">最后编辑时间(升序)</el-radio>
                </el-radio-group>
            </div>
        </el-row>
        <el-space wrap size="large">
          <div class="shell">
            <el-card class="box-card" style="width: 310px" v-if="status==0" :body-style="{ padding: '0px' }">
                <img :src="imgsrc[0]" class="image">
                <div class="pname">
                    <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                    新建项目
                </div>
                <div class="button2">
                <el-button @click="dialogVisible=true" color="#82b38c" :dark="isDark">
                    <div><Plus style="width: 1em; height: 1em;"/></div>
                </el-button>
                </div>
            </el-card>
            <el-card class="box-card" style="width:310px;height: 310px;" v-if="status==2 && allproject.length==0">
                  <el-empty description="回收站无项目" />
            </el-card>
            <el-card class="box-card" style="width:310px;height: 310px;" v-if="status==1 && allproject.length==0">
                  <el-empty description="暂无收藏项目" />
            </el-card>
            <el-card v-for="(project,index) in filterProject" :key="index" class="box-card" style="width: 310px" :body-style="{ padding: '0px' }">
                <div class="textitem">
                    <div class="both front">
                        <img :src="imgsrc[(index + 1) % 4]" class="image">
                        <div class="pname">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            {{project.project_name}}
                        </div>
                        <div class="button2">
                        <el-button class="button" color="#82b38c" v-if="status!=2" @click="toProject(project.project_name, project.project_id)">进入项目</el-button>
                        </div>
                        <span class="button1" v-if="status == 2">
                            <el-popconfirm title="确定要恢复此项目?" @confirm="recover(project.project_name)">
                                <template #reference>
                                    <el-button color="#82b38c">恢&nbsp;复</el-button>     
                                </template>
                            </el-popconfirm>
                        </span>
                    </div>
                    <div class="both form">
                        <el-form :model="project" label-width="140px" label-position="left">
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
                                    <div class="label1"><el-icon><Avatar /></el-icon> 最后编辑者:</div>
                                </template>
                                <span class="show">{{project.last_modification_user}}</span>
                            </el-form-item>  
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span class="show">{{project.last_modification_time}}</span>
                            </el-form-item>
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><CollectionTag /></el-icon> 项目简介:</div>
                                </template>
                                <span class="show" v-if="project.project_info == ''">暂无简介</span>
                                <span class="show" v-else>{{project.project_info}}</span>
                            </el-form-item>
                            <div class="button1" v-if="status == 0">
                                <el-button color="#859dda" @click="starProject(project.project_name)">收藏</el-button>
                                <el-button @click="openRename(project.project_name)" color="#daad81">重命名</el-button>
                                <el-popconfirm title="确定要删除此项目?" @confirm="deletePro(project.project_name)">
                                    <template #reference>
                                    <el-button type="danger">删除</el-button> 
                                    </template>
                                </el-popconfirm>
                            </div>  
                            <div class="button1" v-if="status == 1">
                                <el-popconfirm title="确定取消收藏此项目?" @confirm="cancleStarProject(project.project_name)">
                                    <template #reference>
                                        <el-button color="#859dda">取消收藏</el-button>     
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div class="button1" v-if="status == 2" style="margin-top:30px">
                                <el-popconfirm title="确定要恢复此项目?" @confirm="recover(project.project_name)">
                                    <template #reference>
                                        <el-button color="#82b38c">恢&nbsp;复</el-button>     
                                    </template>
                                </el-popconfirm>
                            </div>
                            <span class="button2" v-if="status!=2">
                        <el-button class="button" color="#468ac8" @click="copyProject(project.project_name)">创建副本</el-button>   
                        <el-button class="button" color="#82b38c" v-if="status!=2" @click="toProject(project.project_name, project.project_id)">进入项目</el-button>
                        </span>
                        </el-form>
                    </div>
                </div>
            </el-card>
          </div>
            <div class="clear"></div>
        </el-space>
      </el-main>
        </el-container>
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
            <span>
            <el-button @click="dialogVisible = false">取消</el-button>
            <span class="button2" style="margin-left:20px;">
            <el-button @click="newProject" color="#859dda">立即创建</el-button>
            </span>
            </span>
            <div class="clear"></div>
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
            <span>
            <el-button @click="dialogVisible = false">取消</el-button>
            <span class="button2" style="margin-left:20px;">
            <el-button @click="rename" color="#859dda">确定</el-button>
            </span>
            </span>
            <div class="clear"></div>
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
            orderType: 1,
            team_id: '',
            dialogVisible: false,
            dialogVisible1: false,
            status: "0",
            search: '',
            allproject: [],
            imgsrc: [require('../../assets/images/e.jpg'), require('../../assets/images/f.jpg'), 
            require('../../assets/images/g.jpg'), require('../../assets/images/h.jpg')],
            newname: '',
            oldname: '',
            newone:{
                name: "",
                info: ""
            }
        }
    },
    watch: {
        status: function(newVal,oldVal){
            console.log("status" + oldVal + "---" + newVal)
            switch(newVal){
                case '0':
                    this.allproject = [];
                    this.getAllProject();
                    console.log('allproject');
                    break;
                case '1':
                    this.allproject = [];
                    this.getStarProject();
                    console.log('starproject');
                    break;
                case '2':
                    this.allproject = [];
                    this.getTrashProject();
                    console.log('trashproject');
                    break;
            }
        },
    },
    created(){
        this.team_id = this.$store.state.team_id;
        this.getAllProject();
        console.log("team_id: "+this.team_id);
    },
    computed:{
        filterProject(){
            const {orderType}=this;
            let fprojects;
            //过滤搜索结果
            fprojects = this.allproject.filter(p => p.project_name.toLowerCase().indexOf(this.search.toLowerCase())!==-1);
            fprojects.sort(function(x,y){
            let a = x.project_name;
            let b = y.project_name;
            console.log(typeof(x.create_time));
                switch(orderType){
                    //1 按项目名
                    case 1:
                        return a.localeCompare(b);
                    //3创建时间升序
                    case 2:
                        if(x.create_time > y.create_time)
                            return -1;
                        return 1;
                    //4创建时间降序
                    case 3:
                        if(x.create_time > y.create_time)
                            return 1;
                        return -1;
                    //5最后编辑时间升序
                    case 4:
                        if(x.last_modification_time > y.last_modification_time)
                            return -1;
                        return 1;
                    //6最后编辑时间降序
                    case 5:
                        if(x.last_modification_time > y.last_modification_time)
                            return 1;
                        return -1;
                }
            })
            console.log(fprojects);
            return fprojects;
        }
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
        getStarProject(){
            this.$axios
                .post("/project/viewFavorite", {
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
        starProject(project_name){
            this.$http
            .post('/project/favorite', {
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
        cancleStarProject(project_name){
            this.$http
            .post('/project/cancelFavorite', {
                project_name: project_name,
                team_id: this.team_id
            })
            .then(res =>{
                console.log(res.data.code);
                console.log(res.data.data);
                switch (res.data.code){
                    case 200:
                        this.getStarProject();
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
        copyProject(project_name){
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
.del {
    float: left;
}
.el-space {
    float: left;
}
.el-card {
    margin: 30px 30px 0 30px;
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
    height: 350px;
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
    margin-left: 50px;
    margin-top: 20px;
    padding-bottom: 5px;
    font-size: 22px;
    color: #859dda;
    border-bottom:4px solid  #859dda;
    font-weight: 600;
    float: left;
    }
.headleft{
    float: right;
}
.label1{
    font-size: 13px;
}
.clear{
    clear: both;
}
.el-form-item {
    margin-bottom: 13px !important;
}
.textitem .show{
  text-align: left;
  width: 130px;   /*一定要设置宽度，或者元素内含的百分比*/
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}
.pname{
    font-size: 25px;
    font-weight: 600;
    width: 260px;
    margin: 20px 20px 20px 20px;
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}
.image{
    width: 310px;
    height: 220px;
    border-radius: 1ch 1ch 0 0;
}
.hint{
    margin-bottom: 20px;
}
.both {
    position: absolute;
}
.front{
    backface-visibility: hidden;
}
.form{
    padding: 20px 10px 10px 15px;
    backface-visibility: hidden;
    transform: rotateY(180deg);
}
.search .el-input{
    width: 300px;
    margin-left: 30px;
    margin-right: 30px;
}
.textitem:hover .form{
    transform: rotateY(0deg);
}
.textitem:hover .front{
    transform: rotateY(180deg);
}
.demo-tabs{
    padding: 0;
    float: left;
}
.el-tabs {
    --el-tabs-header-height: 60px;
    margin-left: 0px !important;
}
.tab{
    font-size: 16px;
    font-weight: 600;
}
.shell {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    /* 设置3d变化 */
    transform-style: preserve-3d;
    /* 添加透视效果 */
    perspective: 900px;
}
.shell .box-card {
    position: relative;
    transition: 0.2s;
    overflow: hidden;
    transform: rotateY(0deg);
    transition-delay: .1s;
}

/* 当鼠标悬浮在当前卡片上时，当前卡片的翻转角度为0，
并放大一点二五倍，加个阴影 */
.shell .box-card:hover {
    transform: rotateY(0deg) scale(1.08);
    box-shadow: 0 25px 40px rgba(0, 0, 0, 0.7);
    z-index: 1;
}

/* 当鼠标悬浮在卡片上时，
当前卡片后面的所有卡片全部都反向翻转负20度 */
.shell .box-card:hover~.box-card {
    transform: rotateY(-6deg);
}


</style>

<style>
.allproject .el-tabs__item:hover {
  color: #859dda;
  border-right: 2px solid #859dda;
}
.allproject .el-tabs__item.is-active {
  border-right: 2px solid #859dda !important;
    color: #859dda;
}
.allproject .el-tabs__active-bar{
    background-color: #859dda;
}
.allproject .button1 .el-button{
    color: white;
}
.allproject .button2 .el-button{
    color: white;
}
</style>


