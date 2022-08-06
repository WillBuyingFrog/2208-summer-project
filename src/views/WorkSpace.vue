<template>
  <div class="workspace">
    <el-container>
      <el-header>
        <el-row>
            <el-col :span="3">
                <div>
                    <img class="logo" src="..\assets\images\logo-1.png" height="60">
                </div>
            </el-col>
            <el-col :span="1">
                <div>
                    <span><div class="title">工作空间</div></span>
                </div>
            </el-col>
            <el-col :span="16"><div/></el-col>
            <el-col :span="1" >
                 <el-badge :value="12" class="item" style="margin-top:15px;">
                    <el-button icon="ChatDotRound">消息</el-button>
                </el-badge>
            </el-col>
            <el-col :span="1">
                <!-- <span class="headleft"><div class="head">{{firstChar}}</div></span> -->
                <el-popover
                    placement="bottom"
                    :width="200"
                    trigger="click">
                  <template #reference>
                    <el-avatar :style="{background:avatarColor}" :size="36"
                    :src="circleUrl" style="margin-top:12px;margin-left: 15px;">
                    {{this.$store.state.user.name.slice(0,1)}}
                    </el-avatar>
                  </template>
                  <UserInfo :avatarColor="avatarColor"></UserInfo>
                </el-popover>
            </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-space wrap size="large">
            <el-card class="box-card" style="width: 600px" :body-style="{ padding: '0px' }">
                <el-row>
                <el-col span="12">
                    <img :src="imgsrc[0]" class="image">
                </el-col>
                <el-col span="12">
                    <div class="textitem">
                        <div class="pname" style="margin-bottom: 40px;">
                            创建新的团队
                        </div>
                    <div class="clear"></div>
                        <el-button @click="dialogVisible = true" color="#859dda" :dark="isDark" plain>
                            <div><Plus style="width: 1em; height: 1em;"/></div>
                        </el-button>
                </div>
                </el-col>
                </el-row>
            </el-card>
            <el-card v-for="i in allteam.length" :key="i" class="box-card" style="width: 600px" :body-style="{ padding: '0px' }">
                <el-row>
                <el-col span="12">
                    <img :src="imgsrc[i % 4]" class="image">
                </el-col>
                <el-col span="12">
                    <div class="textitem">
                        <div class="both front">
                            <div class="pname">
                                {{allteam[i].team_name}}
                            </div>
                            <el-form :model="allteam[i]" label-width="120px" label-position="left">
                                <el-form-item>
                                    <template #label>
                                        <div class="label1"><el-icon><Avatar /></el-icon> 创建时间:</div>
                                    </template>
                                    <span class="show">{{allteam[i].create_time}}</span>
                                </el-form-item>
                            </el-form>
                            <el-button class="button" color="#859dda" :dark="isDark" plain @click="AllProject(allteam[i].team_id)">进入团队</el-button>
                        </div>
                        <div class="both form">
                    <el-form :model="allteam[i]" label-width="120px" label-position="left">
                        <el-form-item>
                            <template #label>
                                <div class="label1"><el-icon><Avatar /></el-icon> 组长:</div>
                            </template>
                            <span class="show">{{allteam[i].leader}}</span>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <div class="label1"><el-icon><User /></el-icon> 成员:</div>
                            </template>
                            <span class="show" v-if="allteam[i].members == ''">暂无成员加入</span>
                            <span class="show" v-else>{{allteam[i].members}}</span>
                        </el-form-item>
                        <el-form-item>
                            <template #label>
                                <div class="label1"><el-icon><InfoFilled /></el-icon> 团队简介:</div>
                            </template>
                            <span class="show" v-if="allteam[i].info == ''">暂无简介</span>
                            <span class="show" v-else>{{allteam[i].info}}</span>
                        </el-form-item>
                    </el-form>
                    <el-button class="button" color="#859dda" :dark="isDark" plain @click="AllProject(allteam[i].team_id)">进入团队</el-button>
                    </div>
                </div>
                </el-col>
                </el-row>
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
                <el-input v-model="newone.name"></el-input>
            </el-form-item>
            <el-form-item label="团队简介">
                <el-input type="textarea" maxlength="200" show-word-limit
                    resize="none" :autosize="{ minRows: 6}" v-model="newone.info" style="width:400px"></el-input>
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
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
import UserInfo from "@/views/account/UserInfo";
export default {
    name: "workSpace",
    components: {UserInfo},
    data() {
        return {
            dialogVisible: false,
            firstChar: "S",//用户名首字母
            allteam: [],
            // team:{
            //     team_name: "团队名",
            //     leader: "someone",
            //     teammate:"123等",
            //     create_time: "2022/08/02 15:28",
            //     team_info: "小学期乱杀"
            // },
            proNum: 4,//项目总数
            newone:{
                name: "",
                info: ""
            },
            imgsrc: [require('../assets/images/a.jpg'), require('../assets/images/b.jpg'), 
            require('../assets/images/c.jpg'), require('../assets/images/d.jpg')],
            avatarColor:'',
        }
    },
    watch: {
	'$route'() {
        // 路由发生变化页面刷新
        this.$router.go(0);
		}
    },
    methods: {
        getTeam(){
            this.$http({
                    method:'post',
                    url:'/team/get/all',
                })
                .then(res =>{
                    console.log(res.data);
                    switch (res.data.code) {
                        case 200:
                            this.allteam = res.data.data;
                            this.proNum = this.allteam.length;
                            break;
                    }
                })
                .catch(err =>{
                    console.log(err);
                })
        },
        AllProject(id){
            this.$store.state.teamid = id
            this.$router.push({
                path:'/allproject',
            })
        },
        newTeam(){
            var id = this.$store.state.user.id;
            if(this.newone.name == undefined || this.newone.name == '' || this.newone.name == null){
                ElMessage.warning('请输入新团队的名称');
            }else if(id == undefined || id == null || id == ''){
                ElMessage.warning('请先登录');
            }
            else{
                this.$http
                    .post("/team/new",
                    {
                        user_id: id,
                        team_name: this.newone.name,
                        team_info: this.newone.info
                    })
                .then(res =>{
                    console.log(res.data.code);
                    switch (res.data.code) {
                        case 200:
                            this.getTeam();
                            ElMessage.success('创建成功！');
                            this.newone.name = '';
                            this.newone.info = '';
                            this.dialogVisible = false;
                            break;
                        case 500:
                            ElMessage.error(res.data.message);
                            console.log(res.data.message);
                            break;
                    }
                })

            }


        }
    },
    created(){
        let R = Math.floor(Math.random() * 130+110);
        let G = Math.floor(Math.random() * 130+110);
        let B = Math.floor(Math.random() * 130+110);
        this.avatarColor = 'rgb(' + R + ',' + G + ',' + B + ', .5)'
        this.getTeam();
    },

}

</script>

<style scoped>
html,body{
    width: 100%;
    height: 100%;
}
.workspace {
    background-image: url("../assets/images/bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
}
/* .textitem {
    padding: 20px 10px 10px 40px;
} */
.textitem .show{
  text-align: left;
  width: 180px;   /*一定要设置宽度，或者元素内含的百分比*/
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}
.workspace .el-header{
    height: 67px;
    padding: 0;
    border-bottom: 1px solid #EFEFEF;
    background-color:rgba(32,80,111,0.6);
}
.image{
    width: 240px;
    height: 200px;
}
.logo {
    padding-left: 10px;
}
.el-space {
    float: left;
    padding-left: 12%;
}
.el-card {
    padding: 0px;
    margin: 30px 30px 0 30px;
    background-color:  rgba(255, 255, 255, 0.62);
    border-radius: 0 2ch 0 2ch;
    box-shadow: 14px 15px 19px -15px #000;
    height: 200px;
}
.el-card .el-form{
    margin-left: 0px;
    padding: 14px 0 0 40px;
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
    color: rgb(210,228,245);
    border-bottom:4px solid  rgb(210,228,245);
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
.el-form-item {
    margin-bottom: 10px !important;
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
    margin-top: 50px;
    margin-left: 20px;
    margin-right: 20px;
    font-size: 30px;
    font-weight: 600;
    width: 320px;
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
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
.both {
    position: absolute;
}
.front{
    backface-visibility: hidden;
}
.form{
    padding-top: 0px 10px 10px 0px;
    backface-visibility: hidden;
    transform: rotateY(180deg);
}
.textitem:hover .form{
    transform: rotateY(0deg);
}
.textitem:hover .front{
    transform: rotateY(180deg);

}
</style>
