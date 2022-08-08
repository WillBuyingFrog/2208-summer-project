<template>
    <el-container class="hp-fill">
        <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
        <el-container  >
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
                <el-row >
                    <el-col :span="5">
                        <el-input
                            class="search"
                            placeholder="搜索成员"
                            :suffix-icon="Search"
                            v-model="input">
                        </el-input>     
                        <el-radio-group v-model="filter" class="select">
                            <el-radio :label="3">全部成员</el-radio>
                            <el-radio :label="6">管理员</el-radio>
                            <el-radio :label="9">普通成员</el-radio>
                        </el-radio-group>   
                        <div class="button1">
                          <el-button v-if="identity=='2'" color="#859dda" icon="CirclePlus" class="add"  disabled>邀请成员</el-button>
                          <el-button v-else color="#859dda" icon="CirclePlus" class="add" @click="dialogVisible = true">邀请成员</el-button>
                        </div>
                        <div v-if="identity !='0'">
                          <el-popconfirm title="确认要离开该团队吗" 
                          confirm-button-text="确定"
                          cancel-button-text="取消"
                          icon-color="#7fa9cc"
                          @confirm="leaveTeam()">
                            <template #reference>
                              <el-button v-if=" identity=='0'" disabled icon="Delete" class="leave" color="#ea867b"  style="color:white;">离开团队</el-button>
                              <el-button v-else icon="Delete" class="leave" color="#ea867b" style="color:white;">离开团队</el-button>
                            </template>
                          </el-popconfirm>
                        </div> 
                        <div>
                          <el-button v-if="identity=='0'" icon="Refresh"  color="#e98176" style="color:white"
                          class="deliver" @click="dialogVisible1 = true">转交团队</el-button>
                          <el-dialog
                              title="转交团队"
                              v-model="dialogVisible1"
                              width="500px"
                              :before-close="handleClose">
                              <el-select v-model="newLeader" filterable placeholder="请选择">
                                <el-option
                                  style="width: 400px;"
                                  v-for="item in tableData "
                                  :key="item.username"
                                  :label="item.username"
                                  :value="item.username">
                                   <el-row>
                                    <el-col :span="9"  v-if="item.username!=this.$store.state.user.name">
                                      <span >{{ item.username }}</span>
                                    </el-col>
                                    <el-col :span="7"  v-if="item.username!=this.$store.state.user.name">
                                      <span style="color: #8492a6; font-size: 13px">{{ item.real_name }}</span>
                                    </el-col>
                                    <el-col :span="8"  v-if="item.username!=this.$store.state.user.name">
                                      <span style="color: #8492a6; font-size: 13px">{{ item.mail }}</span>
                                    </el-col>
                                  </el-row>
                                </el-option>
                              </el-select>
                              <el-button type="primary" icon="CircleCheck" 
                                  @click="changeLeader()" 
                                  color="#859dda" style="margin-left:20px; color:white">确认</el-button>
                          </el-dialog>                      
                        </div>
                        <el-dialog
                            title="邀请成员"
                            v-model="dialogVisible"
                            width="500px"
                            :before-close="handleClose">
                            <el-form :inline="true" class="demo-form-inline">
                              <el-form-item label="用户名">
                                <!-- <el-select
                                  v-model="invite"
                                  filterable
                                  placeholder="请输入用户名关键字"
                                  :remote-method="remoteMethod"
                                  :loading="loading">
                                  <el-option
                                    v-for="item in data"
                                    :key="item"
                                    :label="item"
                                    :value="item"
                                  />
                                </el-select> -->
                                <el-autocomplete
                                          class="el-input"
                                          v-model="invite"
                                          :fetch-suggestions="querySearchAsync"
                                          placeholder="请输入用户名关键字"
                                          :trigger-on-focus="false"
                                          >
                                </el-autocomplete>
                              </el-form-item>
                              <el-form-item class="button1">
                                <el-button color="#859dda" @click="addMember()">确定</el-button>
                              </el-form-item>
                            </el-form>
                        </el-dialog>
                    </el-col>
                    <el-col :span="1">
                        <div style="height:600px; width:0.5px; background:gray"></div>
                    </el-col>
                    <el-col :span="18">
                    <div class="title">
                      <span v-if="filter=='3'">全部成员</span>
                      <span v-else-if="filter=='6'">管理员</span>
                      <span v-else>普通成员</span>
                    </div>
                    <div class="table">
                      <el-table
                      :data="filtrate()"
                      row-style="height:50px"
                      width="1000px">
                        <el-table-column
                          width="45">
                          <!-- <el-avatar :size="28" :src="circleUrl" style="margin:6px 0 0 8px" /> -->
                          <template #default="scope">
                          <el-avatar
                            :size="28"
                            :style="randomRgb()"
                            style="margin:0px 0 0 8px">
                            {{scope.row.username.slice(0,1)}} 
                          </el-avatar>
                          </template>
                        </el-table-column>
                        <el-table-column
                          icon="Search"
                          prop="username"
                          label="昵称"
                          width="150">
                        </el-table-column>
                        <el-table-column
                          prop="real_name"
                          label="真实姓名"
                          width="150">
                        </el-table-column>
                        <el-table-column
                          prop="mail"
                          label="邮箱"
                          width="190">
                        </el-table-column>
                        <el-table-column
                          label="身份"
                          width="150">
                            <template #default="scope">
                            <el-tag v-if="scope.row.authority === 'member'" color="#e5ecff" style="color:#8a9fff">普通成员</el-tag>
                            <el-tag v-else-if="scope.row.authority === 'admin'" color="#ecf9f2" style="color:#53c68c">管理员</el-tag>
                            <el-tag v-else type="warning">所有者</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                          label="操作">
                          <template #default="scope">
                          <el-popover
                            placement="bottom"
                            title="更改权限"
                            :width="150"
                            trigger="click">
                            <div style="margin-top: 10px" class="changeRadio">
                              <el-radio-group v-model="authority" size="small">
                                <el-radio-button label="1" >管理员</el-radio-button>
                                <el-radio-button label="2" >普通成员</el-radio-button>
                              </el-radio-group>
                            </div>
                            <div>
                              <el-button type="primary" plain style="margin-top:15px; margin-left:35px; border-radius:5px;height:20px;"
                              @click=" modifyAuthority(scope.row.username);"
                              color="#a4c2db">确认</el-button>
                            </div>
                            <template #reference>
                              <span class="button1" style="margin-right:10px">
                              <el-button
                              v-if="(scope.row.username==this.$store.state.user.name)||
                              (identity == '1' && scope.row.authority=='leader' ) || identity == '2'"
                              disabled
                              style="border-radius: 7px;height: 27px;"
                              size="small"
                              color="#859dda">
                              编辑
                            </el-button>
                            <el-button
                              v-else
                              style="border-radius: 7px;height: 27px;"
                              size="small"
                              color="#859dda">
                              编辑
                            </el-button>
                            </span>
                            </template>
                          </el-popover>
                          <el-popconfirm title="确认要移除该成员吗" 
                          confirm-button-text="确定"
                          cancel-button-text="取消"
                          icon-color="#7fa9cc"
                          @confirm="removeMember(scope.row.username)" >
                            <template #reference>
                              <el-button
                                v-if="(scope.row.username==this.$store.state.user.name)||
                              (identity == '1' && scope.row.authority!='member' ) || identity == '2'"
                                disabled
                                size="small"
                                color="#e98176"
                                style="border-radius: 7px;height: 27px; color:white"
                                @click="handleDelete(scope.$index, scope.row)">
                                移除
                              </el-button>
                              <el-button
                                v-else
                                size="small"
                                color="#e98176"
                                style="border-radius: 7px;height: 27px; color:white"
                                @click="handleDelete(scope.$index, scope.row)">
                                移除
                              </el-button>
                              
                            </template>
                            </el-popconfirm>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    </el-col>
                </el-row>
                </el-card>
            </el-main>
        </el-container>
    </el-container>
</template>


<script>
import { Search }  from '@element-plus/icons-vue';
import TopGuide from '../../components/TopGuide.vue';
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    return{
      Search,
      TopGuide
    }
  },
  created() {
    this.getList();
    this.getAllUser();
  },
  data () {
    return {
      filter: 3,
      input:'',
      identity: '',
      dialogVisible: false,
      dialogVisible1: false,
      invite:'',
      authority:'1',
      newLeader:'',
      tableData: [],
      userList: [],
    };
  },
  computed:{
    activePath(){
      return this.$route.path
    },
    data(){
      if(this.invite == '')
      return [];
      else 
      return this.userList
    }
  },
  methods: {
     handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      filtrate(){
        var result = []
        if(this.filter == 3){
          result = this.tableData
        }
        else if(this.filter == 6){
          for(var i=0; i<this.tableData.length; i++){
            if(this.tableData[i].authority != 'member')
            result.push(this.tableData[i])
          }
        }
        else{
          for(var j=0; j<this.tableData.length; j++){
            if(this.tableData[j].authority == 'member')
            result.push(this.tableData[j])
          }
        }
        if(this.input == '')
        return result
        else{
          var r = []
          for(var k=0; k<result.length; k++){
            if(result[k].username.includes(this.input) || result[k].real_name.includes(this.input))
            r.push(result[k])
          }
          return r
        }
    },
    randomRgb() {
      let R = Math.floor(Math.random() * 130+110);
      let G = Math.floor(Math.random() * 130+110);
      let B = Math.floor(Math.random() * 130+110);
      return {
          background: 'rgb(' + R + ',' + G + ',' + B + ', .5)'
      };
    },
    getAllUser(){
      const self = this;
      self.$http({
        method:'post',
        url:'user/viewAllUser',
      }).then(res=>{
        console.log(res.data);
        switch(res.data.code){
          case 200:
            
            for(var i=0; i<res.data.data.length; i++){
              this.userList.push({'value':res.data.data[i]})
            }
            //this.userList = res.data.data;
            // this.userList.sort((x, y)=>{
            //   return x.localeCompare(y);
            // });
            break;
          case 500:
            console.log(res.data.message);
        }
      })
    },
    getList(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/member/get',
        params: {
          team_id: this.$store.state.team_id
        },
      }).then(res=>{
        console.log(res.data);
        this.tableData = res.data.data
        for(var i=0; i<this.tableData.length; i++){
          if(this.tableData[i].username == this.$store.state.user.name){
            if(this.tableData[i].authority == 'member')
            this.identity = 2
            else if(this.tableData[i].authority == 'leader')
            this.identity = 0
            else
            this.identity = 1;
            break;
          }
        }
      })
    },
    addMember(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/member/add',
        params: {
          team_id: this.$store.state.team_id,
          invitee_name:this.invite
        },
      }).then(res=>{
        console.log(res.data);
        if(res.data.code == '200'){
          this.dialogVisible=false;
          this.invite='';
          ElMessage.success("邀请成功！")
        }
        else{
          ElMessage.warning('用户名不存在或该用户已在团队中！')
        }
        
        
      })
    },
    leaveTeam(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/member/leave',
        params: {
          team_id: this.$store.state.team_id,
        },
      }).then(res=>{
        console.log(res.data);
        console.log(res.data.data);
        ElMessage.success('离开团队成功');
        setTimeout(() => {
          this.$router.push('/workspace')
        }, 1000);
      })
    },
    removeMember(name){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/member/remove',
        params: {
          team_id: this.$store.state.team_id,
          remove_name:name
        },
      }).then(res=>{
        ElMessage.success('移除成功！');
        console.log(res.data);
        console.log(res.data.data);
        this.getList();
      })      
    },
    modifyAuthority(name){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/member/authority',
        params: {
          team_id: this.$store.state.team_id,
          member_name: name,
          authority: this.authority
        },
      }).then(res=>{
        ElMessage.success('修改成功！')
        console.log(res.data);
        this.getList();
      })       
    },
    changeLeader(){
      const self = this;
      self.$http({
        method:'post',
        url:'/team/change/leader',
        params: {
          team_id: this.$store.state.team_id,
          new_name: this.newLeader,
        },
      }).then(res=>{
        ElMessage.success('转交成功！');
        console.log(res.data);
        console.log(res.data.data);
        this.dialogVisible1 = false
        this.getList();
      })        
    },
    createStateFilter(queryString) {
        return (houseNumber) => {
          return (houseNumber.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
     querySearchAsync(queryString, cb) {
        let userList = this.userList;
        let results = queryString ? userList.filter(this.createStateFilter(queryString)) : userList;
        cb(results)
      },
    },
    

  }

</script>

<style scoped>
  .hp-fill {
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
  .card {
    height: 600px;
    width: 1200px;
    border-radius: 30px;
    margin-left: 100px;
    margin-top: 50px;
    background-color: rgba(250, 250, 250, 0.7);
  }
  .search{
    width:180px;
    margin-top:50px ;
  }
  .select{
    margin: 30px 30px 30px 50px;
  }
  .add{
    height: 40px;
    border-radius: 10px;
    margin-top: 150px;
  }
  .leave{
    height: 40px;
    border-radius: 10px;
    margin-top: 30px;
    left: 20%;
  }
  .deliver{
    height: 40px;
    border-radius: 10px;
    margin-top: 30px;
    left: 20%;
  }
  .title{
    font-size:22px;
    float: left;
    margin-top: 20px;
  }
  .table{
    width: 800px;
    margin-top: 80px;
  }
.button1 .el-button{
    color: white;
}
</style>
<style>
.el-table .cell{
  padding: 0 0;
}
.hp-fill .el-radio__input.is-checked+.el-radio__label {
  color: #859dda;
}
.hp-fill .el-radio__input.is-checked .el-radio__inner{
  border-color: #859dda;
  background-color: #859dda;
}
.hp-fill .el-menu-item.is-active{
  color: #859dda;
}
.el-select-dropdown__item.selected {
    color: #859dda;
    font-weight: 700;
}
.el-select .el-input.is-focus .el-input__wrapper {
    box-shadow: 0 0 0 1px #cccccc inset!important;
}
.el-select .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 1px #cccccc inset!important;
}

</style>

<style lang="scss">
.el-radio-button__original-radio:checked+.el-radio-button__inner {
    color: var(--el-radio-button-checked-text-color,var(--el-color-white));
    background-color: #7fa9cc;
    border-color: var(--el-radio-button-checked-border-color,var(--el-color-primary));
    box-shadow: -1px 0 0 0var(--el-radio-button-checked-border-color,var(--el-color-primary));
}
</style>
