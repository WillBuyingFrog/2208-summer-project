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
                  <el-descriptions-item  :span="2">
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>组长
                      </div>
                    </template>
                    frog
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>创建者
                      </div>
                    </template>
                    frog
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>创建时间
                      </div>
                    </template>
                    2022-8-2 21:06
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label>
                      <div class="cell-item">
                        <el-icon><user /></el-icon>简介
                      </div>
                    </template>
                    2111111106131222222222
                  </el-descriptions-item>
                </el-descriptions>
                <el-button type="primary" icon="Edit" class="edit" @click="dialogVisible = true">修改信息</el-button>
              </el-card>
              <el-dialog
                title="修改信息"
                v-model="dialogVisible"
                width="800px"
                :before-close="handleClose">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="名称">
                    <el-input v-model="name"  style="width: 400px;"
                      type="textarea" maxlength="25" show-word-limit
                      resize="none">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="简介">
                    <el-input  type="textarea" maxlength="200" show-word-limit
                         resize="none" :autosize="{ minRows: 6}"
                         v-model="introduction"
                         style="width:400px">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
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
        dialogVisible: false,
        name:'',
        introduction:''
      };
    }
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
