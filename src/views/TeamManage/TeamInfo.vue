<template>
    <el-container class="hp-fill">
      <el-header style="padding: 0 0 ;">
          <TopGuide/>
      </el-header>
      <el-container>
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
                      <span style="font-size:18px;float:left;margin-top:15px;font-weight:600;">frogteam</span>
                    </el-col>
                  </el-row>
                </div>
                <el-descriptions direction="vertical" :column="2" border class="form">
                  <el-descriptions-item label="组长" :span="2">frog</el-descriptions-item>
                  <el-descriptions-item label="创建者">18100000000</el-descriptions-item>
                  <el-descriptions-item label="创建时间" :span="2">2022-8-2 21:06</el-descriptions-item>
                  <el-descriptions-item label="简介">11111111111111111</el-descriptions-item>
                </el-descriptions>
                <el-button type="primary" icon="Edit" class="edit">修改信息</el-button>
              </el-card>
          </el-main>
      </el-container>
    </el-container>
</template>


<script>
export default {
  setup() {
    return{
   
    }
  },
    data () {
      return {
        
        
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
    background-color: rgba(250, 250, 250, 0.7);
    height: 700px;
    width: 900px;
    border-radius: 30px;
    margin-left: 300px;
    margin-top: 40px;

  }
  .title{
    height: 80px;
    border-bottom:1px solid rgb(230, 230, 230) ;

  }
  .form{
    margin-top: 50px;
    margin-left: 50px;
    width: 800px;
  }
  .edit{
    height: 40px;
    border-radius: 10px;
    margin-top: 120px;
  }
</style>
