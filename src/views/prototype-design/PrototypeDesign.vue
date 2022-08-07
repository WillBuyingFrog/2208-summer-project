<template>
  <div class="prototype-bg">
    <div class="bg-plus">
      <el-container class="outer-container">
        <el-header height="60px" class="header">
          <el-row>
            <el-col :span="1">
                <div class="logo">
                    <img src="../../assets/images/logo-1.png" height="60">
                </div>
            </el-col>
            <el-col  :span="2">
              <el-popconfirm
                  confirm-button-text="Yes"
                  cancel-button-text="No, Thanks"
                  icon-color="#626AEF"
                  title="确认退出编辑?"
                  @confirm="quit()"
              >
                <template #reference>
                  <el-button link icon="Back" class="quit">退出</el-button>
                </template>
              </el-popconfirm>
            </el-col>
            <el-col :span="16">
              <p class="name">{{this.page_name}}</p>
            </el-col>
            <el-col :span="5">
              <el-button
                  circle
                  class="drawer-btn"
                  color="#859dda"
                  :dark="isDark"
                  plain
                  text @click="drawer = true"
              >
                <el-icon class="drawer-icon"><Fold /></el-icon>
              </el-button>
              <el-drawer
                  v-model="drawer"
                  title="全部页面"
                  direction="rtl"
                  size="30%"
              >
                <el-menu
                    default-active="2"
                    class="all-prototypes"
                    @open="handleOpen"
                    @close="handleClose"
                >
                  <el-menu-item
                      v-for="page in allPages"
                      :key="page.page_index"
                      @click="toggle(page)"
                  >{{page.name}}</el-menu-item>
                  <el-menu-item @click="dialogVisible = true">
                    <el-icon><Plus /></el-icon>
                  </el-menu-item>
                  <el-dialog
                      v-model="dialogVisible"
                      width="35%">
                    <template #header>
                      <div class="card-header">
                        <span class="title" style="margin-left: 10px; color: black">
                            新页面
                        </span>
                        <div class="clear"></div>
                      </div>
                    </template>
                    <el-form :model="newone" label-width="80px">
                      <el-form-item label="页面标题">
                        <el-input v-model="newone.name"></el-input>
                      </el-form-item>
                      <el-form-item label="画布大小">
                        <el-input
                            placeholder="宽度X"
                            type="number"
                            v-model="newone.x"
                            style="width:80px;"
                        ></el-input>
                        <el-input
                            placeholder="高度Y"
                            type="number"
                            v-model="newone.y"
                            style="width:80px;margin-left: 20px;"
                        ></el-input>
                      </el-form-item>
                    </el-form>
                    <template #footer>
                      <span class="dialog-footer">
                          <el-button @click="dialogVisible = false">取消</el-button>
                          <el-button type="primary" @click="newPage">立即创建</el-button>
                      </span>
                    </template>
                  </el-dialog>
                </el-menu>
              </el-drawer>
            </el-col>
          </el-row>
        </el-header>
        <el-container class="inner-container">
          <el-main class="mainPane">
            <div class="editor">
              <DesignApp class="editor"></DesignApp>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import DesignApp from "@/views/prototype-design/DesignApp";
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
  name: "PrototypeDesign",
  components: {DesignApp},
  data() {
    return {
      project_id: '',
      file_id: '',
      page_index: 1,
      page_name: '',
      drawer: false,
      dialogVisible: false,
      allPages: [],
      pageNum: 4,
      newone:{
        name: "",
        x: "",
        y: ""
      },
    }
  },
  methods: {
    quit() {
      //ElMessage.success('即将回到工作空间');
      setTimeout(() => {
        // this.$router.push('/workspace')
        this.$router.go(-1);
      }, 0);
    },
    getAllPages(){
      this.$http({
        method:'post',
        url:'/file/page/get',
      })
          .then(res =>{
            console.log(res.data);
            switch (res.data.code) {
              case 200:
                this.allPages = res.data.data;
                this.pageNum = this.allPages.length;
                break;
            }
          })
          .catch(err =>{
            console.log(err);
          })
    },

    newPage(){
      var id = this.$store.state.user.id;
      if(this.newone.name == undefined || this.newone.name == '' || this.newone.name == null){
        ElMessage.warning('请输入新页面的名称');
      }else if(this.newone.x == undefined || this.newone.x == '' || this.newone.x == null){
        ElMessage.warning('请输入画布大小');
      }else if(this.newone.y == undefined || this.newone.y == '' || this.newone.y == null){
        ElMessage.warning('请输入画布大小');
      } else if(id == undefined || id == null || id == ''){
        ElMessage.warning('请先登录');
      }
      else{
        this.$http
            .post("/file/page/new",
                {
                  page_file_id: this.file_id,
                  page_name: this.newone.name,
                })
            .then(res =>{
              console.log(res.data.code);
              switch (res.data.code) {
                case 200:
                  this.getAllPages();
                  this.page_index = res.data.data.page_index;
                  this.page_name = res.data.data.page_name;
                  ElMessage.success('创建成功！');
                  this.newone.name = '';
                  this.newone.x = '';
                  this.newone.y = '';
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

    created(){
      this.file_id = this.$store.state.file_id;
      console.log(this.$store.state.file_id);
      this.getAllPages();
      this.page_index = 1;
      this.page_name = this.allPages[0].page_name;
    },
    toggle(page){
      this.page_name = page.page_name;
      this.page_index = page.page_index;
      // 标题和内容更改
    },
  },
}
</script>

<style scoped>
.prototype-bg {
  background-image: url("../../assets/images/sign-bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: auto;
}
.bg-plus {
  background-color: rgba(255, 255, 255, 0.50);
  min-height: 800px;
  overflow: hidden;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
}
.outer-container {
  height: 800px;
}
.inner-container {
  padding: 10px 0 20px 0;
  margin: 0;

}
.header {
  margin: 0 20px 0 20px;
  border-radius: 0 0 10px 10px;
  background-color: rgba(255, 255, 255, 0.30);
  overflow: hidden;
  box-shadow: 3px 3px 10px #bebebe;

}
.logo {
  position: absolute;
}
.name {
  position: center;
  font-size: 20px;
  margin-top: 15px;
}
.icon {
  margin: 0 0 10px 0;
}
.drawer-btn {
  float: right;
  margin: 10px 0 0 0;
  box-shadow: 3px 3px 10px #859dda;
}
.mainPane {
  margin: 0 0 0 10px;
  padding: 0;
}
.editor {
  width: 100%;
}
.quit{
  line-height: 50px;
  font-size: 15px;
}
</style>
