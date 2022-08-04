<template>
  <div class="allproject">
    <el-container>
      <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
      <el-main>
        <el-tabs v-model="status" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="所有项目" name="0"></el-tab-pane>
            <el-tab-pane label="回收站" name="1"></el-tab-pane>
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
                    <el-button @click="dialogVisible = true">
                        <div><Plus style="width: 1em; height: 1em;"/></div>
                    </el-button>
                </div>
                <div class="hint">快来创建新项目吧！</div>
            </el-card>
            <el-card v-for="i in proNum" :key="i" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                            {{}}项目名
                        </span>
                    <el-button class="button" type="primary" plain v-if="status==0">进入项目</el-button>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="text item">
                    <el-form :model="project" label-width="120px" label-position="left">
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><Avatar /></el-icon> 创建者:</div>
                            </template>
                            <span>{{}}</span>
                        </el-form-item>
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                            </template>
                            <span>{{}}</span>
                        </el-form-item>      
                        <el-form-item>
                            <template #label>  
                                <div class="label1"><el-icon><CollectionTag /></el-icon> 项目简介:</div>
                            </template>
                            <span>2022/08/02 21:46{{}}</span>
                        </el-form-item>
                        <div class="button1" v-if="status == 0">
                            <el-button type="primary" @click="rename">重命名</el-button>
                            <el-button type="danger" @click="deletePro">删&nbsp;除</el-button> 
                        </div>  
                        <div class="button1" v-if="status == 1">
                            <el-button type="danger" @click="recover">恢&nbsp;复</el-button>    
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
                <el-input :v-model="name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newProject">立即创建</el-button>
        </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: "allProject",
    data() {
        return {
            team_id: '',
            dialogVisible: false,
            status: "0",
            proNum: 4,
            project:{},
            newone:{
                name: "",
            }
        }
    },
    created(){
        this.getAllProject();
    },
    methods: {
        getAllProject(){
            this.team_id = this.$route.query.id;
            // this.$axios.post("/project/viewAllProject", {
            //     team_id: this.team_id
            // })
        },
        newProject(){
            this.dialogVisible = false;
        },
        rename(){

        },
        deletePro(){

        },
        recover(){

        }
    }

}

</script>

<style scoped>
.allproject {
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
.pname{
    font-size: 25px;
    float: left;
    font-weight: 600;
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
