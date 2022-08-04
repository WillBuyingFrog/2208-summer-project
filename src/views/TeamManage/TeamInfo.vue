<template>
    <el-container class="hp-fill">
      <el-header style="padding: 0 0 ;">
          <TopGuide/>
      </el-header>
      <el-container>
          <el-aside width="200px">
                <el-menu
                :default-active="activePath"
                class="el-menu-vertical-demo"
                background-color="rgba(250, 250, 250, 0.5)"
                @open="handleOpen"
                @close="handleClose"
                style="height:100vh;"
                router>
                <el-menu-item index="/team">
                  <el-icon><Histogram/></el-icon>
                  <span style="font-size: 15px;">团队信息</span>
                </el-menu-item>
                <el-menu-item index="/team/member" > 
                  <el-icon><UserFilled /></el-icon>
                  <span style="font-size: 15px;">成员信息</span>
                </el-menu-item>
              </el-menu>
          </el-aside>
          <el-main>
              <el-card class="card" body-style="padding:0px">
                <div class="title">
                  <el-row style="margin-top: 30px;">
                    <el-col :span="4">
                    <el-row>
                      <span style="font-size:20px;margin-left:40px; font-weight:700;">团 队</span>
                    </el-row>
                    <el-row>
                      <span style="font-size:20px;margin-left:50px; font-weight:700;">名 称</span>
                    </el-row>
                    </el-col>
                    <el-col :span="20">
                      <span style="font-size:18px;float:left;margin-top:15px;font-weight:600;">{{teamName}}</span>
                    </el-col>
                  </el-row>
                </div>
                <template>
  <el-skeleton :rows="5" />
</template>
                <el-descriptions direction="vertical" :column="2" border class="form">
                  <el-descriptions-item  :span="2">
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>队长
                      </div>
                    </template>
                    {{leader}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>创建者
                      </div>
                    </template>
                    {{creator}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>创建时间
                      </div>
                    </template>
                    {{time}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>简介
                      </div>
                    </template>
                    {{info}}
                  </el-descriptions-item>
                </el-descriptions>
                <div v-if="identity!='0'">
                  <el-button type="primary" icon="Edit" class="edit" @click="dialogVisible = true">修改信息</el-button>
                </div>
                <div >
                  <el-button type="primary" icon="Edit" class="edit" @click="dialogVisible = true">修改信息</el-button>
                  <el-popconfirm title="确认要解散该团队吗？" @confirm="deleteTeam()">
                    <template #reference>
                      <el-button type="danger" icon="Delete" class="edit" style="margin-left:60px">解散团队</el-button>
                    </template>
                  </el-popconfirm>
                </div>
                
              </el-card>
              <el-dialog
                title="修改信息"
                v-model="dialogVisible"
                width="800px"
                :before-close="handleClose">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="名称">
                    <el-input v-model="newName"  style="width: 400px;"
                      type="textarea" maxlength="25" show-word-limit
                      resize="none">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submit1">确定</el-button>
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="简介">
                    <el-input  type="textarea" maxlength="200" show-word-limit
                         resize="none" :autosize="{ minRows: 6}"
                         v-model="newInfo"
                         style="width:400px">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submit2">确定</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
          </el-main>
      </el-container>
    </el-container>
</template>


<script>
import { ElMessage } from 'element-plus';

export default {
  setup() {
    return{
   
    }
  },
  data () {
    return {
        dialogVisible: false,
        teamName:'',
        introduction:'',
        leader:'',
        creator:'',
        time:'',
        info:'',
        newName:'',
        newInfo:'',
        identity:''
      };
  },
  computed:{
    activePath(){
      console.log('路径 '+ this.$route.path.split('/').length)
      if(this.$route.path.split('/').length == 2)
      return '/team' 
      else
      return '/team/member'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    submit1(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/change/name',
        params: {
          team_id: this.$store.state.teamid,
          new_name:self.newName
        },
      }).then(res=>{
        console.log(res.data);
        ElMessage.success('修改成功！')
        this.teamName = this.newName
      })
    },
    submit2(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/change/info',
        params: {
          team_id: this.$store.state.teamid,
          new_info:self.newInfo
        },
      }).then(res=>{
        console.log(res.data);
        ElMessage.success('修改成功！')
        this.info = this.newInfo
      })
    },
    getInfo(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/get/single',
        params: {
          team_id:  this.$store.state.teamid,
        },
      }).then(res=>{
        this.teamName = res.data.data.team_name
        this.creator = res.data.data.creator
        this.leader = res.data.data.leader;
        this.info = res.data.data.info;
        this.time = res.data.data.create_time;
        console.log(res.data);
      })
    },
    getList(){
      const self = this;
      var tableData=[];
      self.$http({
        method:'post',
        url:'/team/member/get',
        params: {
          team_id: this.$store.state.teamid
        },
      }).then(res=>{
        tableData = res.data.data
        console.log(res.data);
        for(var i=0; i<tableData.length; i++){
          if(tableData[i].username == this.$store.state.user.name){
            if(tableData[i].authority == 'member')
            this.identity = 2
            else if(tableData[i].authority == 'leader')
            this.identity = 0
            else
            this.identity = 1;
            break;
          }
        }
        console.log('身份'+this.identity)
      })
    },
    deleteTeam(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/remove',
        params: {
          team_id: this.$store.state.teamid
        },
      }).then(res=>{
        console.log(res.data);
        ElMessage.success("解散团队成功！")
        setTimeout(() => {
          this.$router.push('/workspace')
        }, 1000);
      })

    }
  },
  created(){
    this.getInfo();
    this.getList();
  },
}
</script>

<style scoped>
  .hp-fill {
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
  .card {
    background-color: rgba(250, 250, 250, 0.7);
    height: 600px;
    width: 900px;
    border-radius: 30px;
    margin-left: 280px;
    margin-top: 20px;

  }
  .title{
    height: 80px;
    border-bottom:1px solid rgb(230, 230, 230) ;

  }
  .form{
    border-radius: 60px;
    margin-top: 50px;
    margin-left: 50px;
    width: 800px;
  }
  .edit{
    height: 40px;
    border-radius: 10px;
    margin-top: 120px;
  }
  .cell-item {
  display: flex;
  align-items: center;
}
</style>
