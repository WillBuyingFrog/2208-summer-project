<template>
  <div class="workspace">
    <el-container>
      <el-header>
        <el-row>
            <el-col :span="1">
                <div>
                    <img class="logo" src="..\assets\images\logo.png" height="60">
                </div>
            </el-col>         
            <el-col :span="4">
                <div>
                    <span><div class="title">工作空间</div></span> 
                </div>
            </el-col> 
            <el-col :span="15"><div/></el-col>
            <el-col :span="4">
                <span class="headleft"><div class="head">{{firstChar}}</div></span>
            </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-space wrap size="large">
            <el-card :key="i" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <User style="width: 0.8em; height: 0.8em;"/>
                            <User style="width: 0.5em; height: 0.5em; margin-left:-6px"/>
                            新建团队
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="new">
                    <el-button @click="dialogVisible = true">
                        <div><Plus style="width: 1em; height: 1em;"/></div>
                    </el-button>
                </div>
                <div class="hint">快来创建你的专属团队吧！</div>
            </el-card>
            <el-card v-for="i in proNum" :key="i" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <User style="width: 0.8em; height: 0.8em;"/>
                            <User style="width: 0.5em; height: 0.5em; margin-left:-6px"/>
                            {{team.team_name}}
                        </span>
                    <el-button class="button" type="primary" plain>进入团队</el-button>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="text item">
                    <el-form :model="team" label-width="120px" label-position="left">
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>  
                                <div class="label1"><el-icon><Avatar /></el-icon> 组长:</div>
                            </template>
                            <span>{{team.leader}}</span>
                        </el-form-item>
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>  
                                <div class="label1"><el-icon><User /></el-icon> 成员:</div>
                            </template>
                            <span>{{team.teammate}}</span>
                        </el-form-item>      
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>  
                                <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                            </template>
                            <span>{{team.create_time}}</span>
                        </el-form-item>
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>  
                                <div class="label1"><el-icon><InfoFilled /></el-icon> 团队简介:</div>
                            </template>
                            <span>{{team.team_info}}</span>
                        </el-form-item>                     
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
                            <User style="width: 0.8em; height: 0.8em;"/>
                            <User style="width: 0.5em; height: 0.5em; margin-left:-6px"/>
                            新建团队
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
        <el-form :model="newone" label-width="80px">
            <el-form-item label="团队名称">
                <el-input :v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="团队简介">
                <el-input :v-model="info" :autosize="{ minRows: 3, maxRows: 6 }" 
                type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newTeam">立即创建</el-button>
        </span>
        </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
    name: "workSpace",
    data() {
        return {
            dialogVisible: false,
            firstChar: "S",//用户名首字母
            team:{
                team_name: "团队名",
                leader: "someone",
                teammate:"123等",
                create_time: "2022/08/02 15:28",
                team_info: "小学期乱杀"
            },
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
.workspace {
  background-image: url("../assets/images/bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
}
.workspace .el-header{
    height: 67px;
    padding: 0;
    border-bottom: 1px solid #EFEFEF;
    background-color: rgba(255, 255, 255, 0.4);
}
.logo {
    padding-left: 10px;
}
.el-space {
    float: left;
    padding-left: 12%;
}
.el-card {
    margin: 30px 30px 0 30px;
    background-color:  rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
}
.el-card .el-form{
    margin-left: 15px;
}
.el-dialog .el-form{
    margin-left:50px;
    margin-right: 100px;
}
.dialog-footer {
    float: calc();
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
    margin-top:20px;
    margin-bottom: 30px;
    height: 120px;
    width: 120px;
}

.hint{
    margin-bottom: 10px;
}
</style>
