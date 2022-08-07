<template >
    <div style="background-color:rgba(250, 250, 250, 0.6);height:60px">
        <el-row >
            <el-col :span="2">
            <span style="float:left;margin-left: 30px;"> <img src="../assets/images/logo-1.png" height="58"/></span>    
            </el-col>
            <el-col :span="2" >
              <div style="margin-top:14px">
                <el-button text @click="this.$router.push('/workspace')" 
                  style="font-size:15.5px;padding-left:7px;padding-right:7px;">工作空间</el-button>
                <el-popover
                    placement="bottom"
                    :width="330"
                    trigger="click">
                  <template #reference>
                    <el-button text icon="CaretBottom" 
                      style=" margin-left:0; padding-left:7px; padding-right:7px"></el-button>
                  </template>
                  <TeamList></TeamList>
                </el-popover>
              </div>            
            </el-col>
            <el-col :span="12" :offset="4">
                <el-menu
                    :default-active="activePath"
                    class="el-menu-demo"
                    style="background:unset"
                    mode="horizontal"
                    :ellipsis="false"
                    text-color="#000000"
                    active-text-color="#409EFF"
                    @select="handleSelect"
                    router>
                    <el-menu-item index="/allproject">
                        <el-icon><DataLine/></el-icon>
                        <span style="font-size: 16px;">项目管理</span>
                    </el-menu-item>
                    <el-menu-item index="/team" style="margin-left:70px">
                        <el-icon><Coordinate/></el-icon>
                        <span style="font-size: 16px;">团队管理</span>
                    </el-menu-item>
                    <el-menu-item index="" style="margin-left:70px">
                        <el-icon><DocumentCopy/></el-icon>
                        <span style="font-size: 16px;">文档中心</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
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
                <el-popover
                    placement="bottom"
                    :width="200"
                    trigger="click">
                  <template #reference>
                    <el-avatar :style="{background:avatarColor}" :size="36" 
                     style="margin-top:12px;margin-left: 15px;"> 
                    {{this.$store.state.user.name.slice(0,1)}} 
                    </el-avatar>
                  </template>
                  <UserInfo :avatarColor="avatarColor"></UserInfo>
                </el-popover>
            </el-col>
        </el-row>
    </div>
</template>


<style scoped>
  .space{
    border-bottom: 0;
  }
</style>

<script>
import UserInfo from "@/components/UserInfo.vue";
import TeamList from "@/components/TeamList.vue";
import { ElMessage } from "element-plus";
import 'element-plus/dist/index.css'
export default {
  components: {UserInfo,TeamList},
  data(){
    return{
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
  created(){
    let R = Math.floor(Math.random() * 130+110);
    let G = Math.floor(Math.random() * 130+110);
    let B = Math.floor(Math.random() * 130+110);
    this.avatarColor = 'rgb(' + R + ',' + G + ',' + B + ', .5)'
    this.getMessage();
  },
   computed:{
    activePath(){ 
      if(this.$route.path.split('/')[1] == 'team')
      return '/team' 
      else
      return '/allproject'
    }
  },
  methods: {
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
          this.unreadNumber--;
        })
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
    },

  }
}
</script>