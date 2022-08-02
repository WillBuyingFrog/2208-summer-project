<template>
    <el-container class="hp-fill">
        <el-header style="padding: 0 0 ;">
          <TopGuide/>
        </el-header>
        <el-container  >
            <el-aside width="200px">
                <el-menu
                :default-active="2"
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
                        <el-button type="primary" icon="CirclePlus" class="add">添加成员</el-button>
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
                      :data="tableData"
                      row-style="height:40px"
                      width="800">
                        <el-table-column
                          width="45">
                          <el-avatar :size="28" :src="circleUrl" style="margin:6px 0 0 8px" />
                        </el-table-column>
                        <el-table-column
                          icon="Search"
                          prop="name"
                          label="昵称"
                          width="150">
                        </el-table-column>
                        <el-table-column
                          prop="realName"
                          label="真实姓名"
                          width="150">
                        </el-table-column>
                        <el-table-column
                          prop="email"
                          label="邮箱"
                          width="190">
                        </el-table-column>
                        <el-table-column
                          prop="identity"
                          label="身份"
                          width="150">
                        </el-table-column>
                        <el-table-column
                          label="操作">
                          <template #default="scope">
                            <el-button
                              style="border-radius: 7px;height: 27px;"
                              size="small"
                              type="primary"
                              @click="handleDelete(scope.$index, scope.row)">
                              编辑
                            </el-button>
                            <el-button
                              style="border-radius: 7px;height: 27px;"
                              size="small"
                              type="danger"
                              @click="handleDelete(scope.$index, scope.row)">
                              移除
                            </el-button>
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
export default {
  setup() {
    return{
      Search,
      TopGuide
    }
  },
    data () {
      return {
        filter:3,
        input:'',
        tableData: [{
            name: 'wxh1234567',
            realName:'王小虎',
            email: '206911518@qq.com',
            identity:'管理员',
          }, {
            name: 'wxh1234567',
            realName:'王小虎',
            email: '206911518@qq.com',
            identity:'管理员',
          }, {
            name: 'wxh1234567',
            realName:'王小虎',
            email: '206911518@qq.com',
            identity:'管理员',
          }, {
            name: 'wxh1234567',
            realName:'王小虎',
            email: '206911518@qq.com',
            identity:'管理员',
          }
        ]
      };
    }
  }

</script>

<style scoped>
  .hp-fill {
  background-image: url("../../assets/images/homepage_bk.png");
  background-repeat: repeat-y;
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
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
    margin-top: 200px;
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

</style>
<style>
.el-table .cell{
  padding: 0 0;
}
</style>