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
                <el-popover
                placement="bottom"
                :width="460"
                hide-after="0"
                 :visible="visible">
                <el-container style="height:500px;">
                  <el-header style="height:50px;">
                    <el-row>
                      <el-col :span="9">
                        <el-tabs v-model="status" style="height: 50px;">
                              <el-tab-pane label="邀请" name="0">
                              </el-tab-pane>
                            <el-tab-pane label="通知" name="1">
                              </el-tab-pane>
                        </el-tabs>
                      </el-col> 
                      <el-col :span="3" :offset="9">
                        <el-select v-model="value"  placeholder="Select" style="height:30px;width:100px;margin-top:5px;">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-col>
                    </el-row>
                     <el-divider />
                  </el-header>
                  <el-main>
                     <el-scrollbar >
                    <el-table :data="invite_filter()" style="width: 100%" v-if="status=='0'" :show-header="false">
                      <el-table-column
                        width="40">
                        <template #default="scope">
                          <el-checkbox v-if="scope.row._read == false" v-model="scope.row._read" @click="readed(scope.row.message_id)"></el-checkbox>
                          <el-checkbox v-else v-model="scope.row._read" disabled></el-checkbox>
                        </template>
                      </el-table-column>
                      <el-table-column
                        width="210">
                        <template #default="scope">
                          {{scope.row.sender.split('(')[0].split(' ')[1]}} 邀请您加入团队:<br />{{scope.row.team_name}}
                        </template>
                      </el-table-column>
                      <el-table-column>
                        <template #default="scope">
                          {{timeago(scope.row.create_time)}}
                        </template>
                      </el-table-column>
                      <el-table-column>
                        <template #default="scope">
                           <el-button type="primary" size="small" @click="accept(scope.row.message_id)">接受</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-table :data="notice_filter()" style="width: 100%" v-else :show-header="false">
                      <el-table-column
                        width="40">
                        <template #default="scope">
                          <el-checkbox v-if="scope.row._read==false" v-model="scope.row._read" @click="readed(scope.row.message_id)"></el-checkbox>
                          <el-checkbox v-else v-model="scope.row._read" disabled></el-checkbox>
                        </template>
                      </el-table-column>
                      <el-table-column
                        width="280"
                        prop="message_content">
                      </el-table-column>
                      <el-table-column>
                        <template #default="scope">
                          {{timeago(scope.row.create_time)}}
                        </template>
                      </el-table-column>
                    </el-table>
                    </el-scrollbar>

                  </el-main>
                  <el-footer >
                    <el-button @click="readedAll()">标记全部为已读</el-button>
                  </el-footer>
                </el-container>
                <template #reference>
                  <el-badge :value="unreadNumber" class="item" style="margin-top:15px;">
                    <el-button icon="ChatDotRound" @click="visible = !visible">消息</el-button>
                  </el-badge>
                </template>
              </el-popover>
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
            <el-card v-for="team in allteam" :key="team.team_id" class="box-card" style="width: 300px">
                <template #header>
                    <div class="card-header">
                        <span class="pname">
                            <User style="width: 0.8em; height: 0.8em;"/>
                            <User style="width: 0.5em; height: 0.5em; margin-left:-6px"/>
                            {{team.team_name}}
                        </span>
                    <el-button class="button" type="primary" plain @click="AllProject(team.team_id)">进入团队</el-button>
                    <div class="clear"></div>
                    </div>
                </template>
                <div class="textitem">
                    <el-form :model="team" label-width="120px" label-position="left">
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>
                                <div class="label1"><el-icon><Avatar /></el-icon> 组长:</div>
                            </template>
                            <span class="show">{{team.leader}}</span>
                        </el-form-item>
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>
                                <div class="label1"><el-icon><User /></el-icon> 成员:</div>
                            </template>
                            <span class="show">{{team.members}}</span>
                        </el-form-item>
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>
                                <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                            </template>
                            <span class="show">{{team.create_time}}</span>
                        </el-form-item>
                        <el-form-item>
                            <!-- 重写label -->
                            <template #label>
                                <div class="label1"><el-icon><InfoFilled /></el-icon> 团队简介:</div>
                            </template>
                            <span class="show">{{team.info}}</span>
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
import { ElMessage } from "element-plus";
import 'element-plus/dist/index.css'
import UserInfo from "@/components/UserInfo.vue";
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
            avatarColor:'',
            visible:false,
            options: [{
            value: '0',
            label: '全部'
            }, {
            value: '1',
            label: '已读'
            }, {
            value: '2',
            label: '未读'
            }],
            value: '0',
            status:'0',
            checked:'',
            notice: [],
            invite:[],
            unreadNumber:'0',
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
        },
        timeago (time) {
            var data = new Date(time);
            var dateTimeStamp = data.getTime()
            var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
            var hour = minute * 60;
            var day = hour * 24;
            var week = day * 7;
            var month = day * 30;
            var year = month * 12;
            var now = new Date().getTime();   //获取当前时间毫秒
            var diffValue = now - dateTimeStamp;//时间差

            var result = "";
            if (diffValue < 0) {
                result = "" + "未来";
            }
            var minC = diffValue / minute;  //计算时间差的分，时，天，周，月
            var hourC = diffValue / hour;
            var dayC = diffValue / day;
            var weekC = diffValue / week;
            var monthC = diffValue / month;
            var yearC = diffValue / year;

            if (yearC >= 1) {
                result = " " + parseInt(yearC) + "年前"
            } else if (monthC >= 1 && monthC < 12) {
                result = " " + parseInt(monthC) + "月前"
            } else if (weekC >= 1 && weekC < 5 && dayC > 6 && monthC < 1) {
                result = " " + parseInt(weekC) + "周前"
            } else if (dayC >= 1 && dayC <= 6) {
                result = " " + parseInt(dayC) + "天前"
            } else if (hourC >= 1 && hourC <= 23) {
                result = " " + parseInt(hourC) + "小时前"
            } else if (minC >= 1 && minC <= 59) {
                result = " " + parseInt(minC) + "分钟前"
            } else if (diffValue >= 0 && diffValue <= minute) {
                result = "刚刚"
            }
            return result
        },

    invite_filter(){
        var data=[];
        if(this.value == '0')
        return this.invite;
        else if(this.value == '1'){
          for(var i=0; i<this.invite.length; i++){
            if(this.invite[i]._read == true)
              data.push(this.invite[i])
          }
          return data;
        }
        else{
          for(var j=0; j<this.invite.length; j++){
            if(this.invite[j]._read == false)
              data.push(this.invite[j])
          }
          return data;
        }
      },
    notice_filter(){
        var data=[];
        if(this.value == '0')
        return this.notice;
        else if(this.value == '1'){
          for(var i=0; i<this.notice.length; i++){
            if(this.notice[i]._read == true)
              data.push(this.notice[i])
          }
          return data;
        }
        else{
          for(var j=0; j<this.notice.length; j++){
            if(this.notice[j]._read == false)
              data.push(this.notice[j])
          }
          return data;
        }
    },
    getMessage(){
        const self = this;
        self.$http({
          method:'post',
          url:'/message/get',
        }).then(res=>{
          console.log(res.data.data)
          for(var i=0; i<res.data.data.length; i++){
            if(res.data.data[i].type == '1')
              this.invite.push(res.data.data[i])
            else
              this.notice.push(res.data.data[i])
            if(res.data.data[i]._read == false)
            this.unreadNumber++;  
          }
        })
    },
    readed(message_id){
        const self = this;
        self.$http({
          method:'post',
          url:'/message/read',
          params: {
          message_id: message_id
        },
        }).then(res=>{
          console.log(res.data);
          
        })
        this.unreadNumber--;
    },
    readedAll(){
      if(this.status == '0'){
        for(var i=0; i<this.invite.length; i++){
          if(this.invite[i]._read == false){
            this.$http({
              method:'post',
              url:'/message/read',
              params: {
              message_id: this.invite[i].message_id
            },
            })
            this.unreadNumber--;
            this.invite[i]._read = true;
          }
        }
      }
      else{
        for(var j=0; j<this.notice.length; j++){
          if(this.notice[j]._read == false){
            this.$http({
              method:'post',
              url:'/message/read',
              params: {
              message_id: this.notice[j].message_id
            },
            })
            this.unreadNumber--;
            this.notice[j]._read = true;
          }
        }
      }
    },
    accept(message_id){
        const self = this;
        self.$http({
          method:'post',
          url:'/message/accept',
          params: {
          message_id: message_id
        },
        }).then(res=>{
          console.log(res.data);
          ElMessage.success("成功加入团队")
        })
    }
    },
    created(){
        let R = Math.floor(Math.random() * 130+110);
        let G = Math.floor(Math.random() * 130+110);
        let B = Math.floor(Math.random() * 130+110);
        this.avatarColor = 'rgb(' + R + ',' + G + ',' + B + ', .5)'
        this.getTeam();
        this.getMessage();
    },

}

</script>

<style scoped>
.workspace {
  background-image: url("../assets/images/bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: auto;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
}
.textitem .show{
  text-align: left;
  width: 100%;   /*一定要设置宽度，或者元素内含的百分比*/
  overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
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
    margin-left: 5px;
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
    margin-top:20px;
    margin-bottom: 30px;
    height: 120px;
    width: 120px;
}

.hint{
    margin-bottom: 10px;
}
</style>