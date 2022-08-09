<template>
    <el-container class="hp-fill">
      <el-header style="padding: 0 0 ;">
          <TopGuide/>
      </el-header>
      <el-container>
          <el-aside width="200px" style="height: 100vh;background-color:rgba(250, 250, 250, 0.5)">
                <el-menu
                :default-active="activePath"
                class="el-menu-vertical-demo"
                background-color="rgba(250, 250, 250, 0)"
                @open="handleOpen"
                @close="handleClose"
                router>
                <el-menu-item index="/team" style="margin-top:12%;">
                  <el-icon><Histogram/></el-icon>
                  <span style="font-size: 14px;">团队信息</span>
                </el-menu-item>
                <el-menu-item index="/team/member" > 
                  <el-icon><UserFilled /></el-icon>
                  <span style="font-size: 14px;">成员信息</span>
                </el-menu-item>
              </el-menu>
          </el-aside>
          <el-main>
              <el-card class="card" body-style="padding:0px">
                <div class="title">
                  <el-row >
                    <el-col :span="6" style="height: 80px;">
                      <span style="font-size:20px;font-weight:700;line-height: 80px;">团 队 名 称</span>
                    </el-col>
                    <el-col :span="18" style="height: 80px;" >
                      <span style="font-size:18px;float:left;line-height: 80px;font-weight:600;">{{teamName}}</span>
                    </el-col>
                  </el-row>
                </div>
                <el-descriptions direction="vertical" :column="2" border class="form">
                  <el-descriptions-item  :span="2">
                    <template #label>
                      <div class="cell-item">
                        <el-icon><UserFilled /></el-icon>队长
                      </div>
                    </template>
                    {{leader}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><Avatar /></el-icon>创建者
                      </div>
                    </template>
                    {{creator}}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><Timer /></el-icon>创建时间
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
                    <span v-if="info != ''">{{info}}</span>
                    <span v-else>暂无简介</span>
                  </el-descriptions-item>
                </el-descriptions>
                <div v-if="identity!='0'" class="button1">
                  <el-button color="#859dda" icon="Edit" class="edit" @click="dialogVisible = true">修改信息</el-button>
                </div>
                <div v-else class="button1">
                  <el-button color="#859dda" icon="Edit" class="edit" @click="dialogVisible = true">修改信息</el-button>
                  <el-popconfirm title="确认要解散该团队吗？" 
                          confirm-button-text="确定"
                          cancel-button-text="取消"
                          icon-color="#7fa9cc"
                          @confirm="deleteTeam()">
                    <template #reference>
                      <el-button  icon="Delete" class="edit" style="margin-left:60px"
                      color="#e98176">解散团队</el-button>
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
                    <el-button type="primary" @click="submit1" color="#859dda" style="color:white" >确定</el-button>
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
                    <el-button type="primary" @click="submit2" color="#859dda" style="color:white">确定</el-button>
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
      return this.$route.path
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
          team_id: this.$store.state.team_id,
          new_name:self.newName
        },
      }).then(res=>{
        console.log(res.data);
        ElMessage.success('修改成功！')
        this.newName=''
        this.teamName = this.newName
      })
    },
    submit2(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/change/info',
        params: {
          team_id: this.$store.state.team_id,
          new_info:self.newInfo
        },
      }).then(res=>{
        console.log(res.data);
        ElMessage.success('修改成功！')
        this.newInfo=''
        this.info = this.newInfo
      })
    },
    getInfo(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/get/single',
        params: {
          team_id:  this.$store.state.team_id,
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
          team_id: this.$store.state.team_id
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
      })
    },
    deleteTeam(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/remove',
        params: {
          team_id: this.$store.state.team_id
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
    /*background-color: rgb(196,217,226);*/
    background-image: url("../../assets/images/bg.jpg");
    background-repeat: repeat-y;
    min-height: 800px;
    overflow: auto;
    position: fixed;
    background-position:center;
    background-size: 100% auto;
    width: 100%;
    height: 100%;
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
.button1 .el-button{
    color: white;
}
</style>

<style>
.hp-fill .el-menu-item.is-active{
  color: #859dda;
}
</style>
