<template>
  <div class="prototype-bg">
    <div class="bg-plus">
      <el-container class="outer-container">
        <el-header height="60px" class="header">
          <el-row>
            <el-col :span="3">
                <div class="logo">
                    <img src="../../assets/images/logo-1.png" height="60">
                </div>
            </el-col>
            <el-col :span="18">
              <p class="name">
                {{this.page_name}}
                <el-icon class="edit-icon" @click="dialogVisible=true"><Edit></Edit></el-icon>
              </p>
              <el-dialog
                  v-model="dialogVisible"
                  width="35%">
                <template #header>
                  <div class="card-header">
                    <span class="title" style="margin-left: 10px; color: black">
                        <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                        重命名页面
                    </span>
                  </div>
                </template>
                <el-form label-width="100px">
                  <el-form-item label="新标题">
                    <el-input v-model="newname"></el-input>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                      <span>
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <span class="button2" style="margin-left:20px;">
                        <el-button @click="rename" color="#859dda">确定</el-button>
                        </span>
                    </span>
                  </span>
                </template>
              </el-dialog>
            </el-col>
            <el-col :span="1">
              <el-dropdown
                  @command="handleCommand"
                  trigger="click"
              >
                <el-button
                    class="drawer-btn"
                    color="#859dda"
                    :dark="isDark"
                    plain
                >
                  <el-icon class="drawer-icon"><VideoPlay /></el-icon>
                  预览
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="a">生成预览</el-dropdown-item>
                    <el-dropdown-item command="b" :disabled="existView">销毁预览</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
<!--              <el-button-->
<!--                  class="drawer-btn"-->
<!--                  color="#859dda"-->
<!--                  :dark="isDark"-->
<!--                  plain-->
<!--                  text @click="drawer = true"-->
<!--              >-->
<!--                <el-icon class="drawer-icon"><VideoPlay /></el-icon>-->
<!--                预览-->
<!--              </el-button>-->
            </el-col>
            <el-col :span="2">
              <el-button
                  class="drawer-btn"
                  color="#859dda"
                  :dark="isDark"
                  plain
                  text @click="drawer = true"
              >
                <el-icon class="drawer-icon"><Fold /></el-icon>
                页面列表
              </el-button>
              <el-drawer
                  v-model="drawer"
                  title="全部页面"
                  direction="rtl"
                  size="20%"
              >
                <el-menu
                    :defaultw-active="activeIndex"
                    class="all-prototypes"
                    @select="handleSelect"
                    text-color="#000000"
                    active-text-color="#409EFF"
                >
                  <el-menu-item
                      v-for="page in allPages"
                      :key="page.page_index"
                      :index="page.page_index.toString()"
                      @click="toggle(page)"
                  >{{page.page_name}}</el-menu-item>
                  <p @click="newPage">
                    <el-icon class="edit-icon"><Plus /></el-icon>
                  </p>
                  <span @click="deleteVisible=true">
                    <el-icon class="edit-icon"><Delete /></el-icon>
                    <el-dialog
                        v-model="deleteVisible"
                        width="20%">
                      <template #header>
                        <div class="card-header">
                          <span class="title" style="margin-left: 10px; color: black">
                              <el-icon ><EditPen /></el-icon>删除页面
                          </span>
                        </div>
                      </template>
                      <el-form :model="toDelete" label-width="100px">
                        <el-form-item label="待删除页面">
                          <el-select v-model="toDelete" placeholder="请选择页面">
                            <el-option
                                v-for="page in allPages"
                                :key="page.page_index"
                                :label="page.page_name"
                                :value="page.page_index"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-form>
                      <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="deleteVisible = false">取消</el-button>
                            <el-button type="primary" @click="deletePage">删除</el-button>
                        </span>
                      </template>
                    </el-dialog>
                  </span>
                </el-menu>
              </el-drawer>
            </el-col>
          </el-row>
        </el-header>
        <el-container class="inner-container">
          <el-main class="mainPane">
            <div class="editor">
<!--              <DesignApp class="editor" :initWidth="900" :initHeight="900"></DesignApp>-->
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
// import DesignApp from "@/views/prototype-design/DesignApp";
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
//
// import eventBus from "@/views/prototype-design/utils/eventBus";
// import {EVENT_DESIGNER_SWITCH} from "@/views/prototype-design/event-enum"

export default {
  name: "PrototypeDesign",
  // components: {DesignApp},
  data() {
    return {
      project_id: '',
      file_id: '',
      page_name: '',
      drawer: false,
      dialogVisible: false,
      deleteVisible: false,
      toDelete: '',
      allPages: [],
      pageNum: 1,
      newname: '',
      activeIndex: '1',
      activeFileId: '',
      existView: false,
    }
  },
  created(){
    this.file_id = this.$store.state.file_id;
    console.log(this.file_id);
    this.getAllPages(1);
    console.log('hi');
  },

  methods: {
    deletePage() {
      console.log("delete");
      console.log(this.toDelete);
      var id = this.$store.state.user.id;
      if(id == undefined || id == null || id == ''){
        ElMessage.warning('请先登录');
      }else {
        this.$http
            .post('/file/page/delete', {
              prototype_id: this.file_id,
              page_index: this.toDelete,
            })
            .then(res => {
              switch (res.data.code) {
                case 200:
                  ElMessage.success('删除成功！');
                  this.getAllPages(1);
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  console.log(res.data.message);
                  break;
              }
            })
      }
      this.toDelete = '';
      this.deleteVisible = false;
    },
    rename(){
      if(this.newname == '' || this.newname == null || this.newname == undefined){
        ElMessage.warning("新标题不能为空")
      }else{
        this.$http
            .post('/file/page/rename', {
              prototype_id: this.file_id,
              page_name: this.newname,
              page_index: this.activeIndex
            })
            .then(res =>{
              console.log(res.data.code);
              console.log(res.data.data);
              switch (res.data.code){
                case 200:
                  this.getAllPages(this.page_index);
                  ElMessage.success("重命名成功!");
                  this.page_name = this.newname;
                  this.newname = '';
                  this.dialogVisible = false;
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  break;
              }
            })
            .catch(err => {
              console.log(err);
            })
      }
    },
    getAllPages(index){
      console.log(this.$store.state.file_id)
      this.$http
          .post('/file/page/get', {
            prototype_id: this.$store.state.file_id,
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data);
            console.log(res.data.data.length);
            console.log(res.data.data[0].page_name);
            switch (res.data.code) {
              case 200:
                this.allPages = res.data.data;
                this.pageNum = this.allPages.length;
                this.activeIndex = index;
                this.page_name = res.data.data[index-1].page_name;
                console.log(this.allPages.length);
                console.log(this.allPages[0].page_name);
                break;
            }
          })
          .catch(err =>{
            console.log(err);
          })
    },

    newPage(){
      var id = this.$store.state.user.id;
      if(id == undefined || id == null || id == ''){
        ElMessage.warning('请先登录');
      }
      else {
        this.$http
            .post("/file/page/new",
                {
                  prototype_id: this.file_id,
                  // page_name: this.newone.name,
                })
            .then(res => {
              console.log(res.data.code);
              switch (res.data.code) {
                case 200:
                  this.getAllPages(res.data.data.page_index);
                  ElMessage.success('创建成功！');
                  // this.newone.name = '';
                  // this.newone.x = '';
                  // this.newone.y = '';
                  // this.dialogVisible = false;
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  console.log(res.data.message);
                  break;
              }
            })
      }
    },
    toggle(page){
      this.page_name = page.page_name;
      this.activeIndex = page.page_index;
      this.activeFileId = page.page_id;
      console.log("toggle");
      // 标题和内容更改
      // eventBus.$emit(EVENT_DESIGNER_SWITCH, {
      //   newPageFileId: this.activeFileId
      // })

    },
    handleSelect(key) {
      console.log(this.activeIndex)
      console.log(key);
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
.edit-icon {
  font-size: 20px;
}
.edit-icon :hover {
  color: #999999;
}
.icon {
  margin: 0 0 10px 0;
}
.drawer-btn {
  float: right;
  margin: 15px 0 0 0;
  box-shadow: 3px 3px 10px #859dda;
  border-radius: 30px;
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
.button2 .el-button{
  color: white;
}
</style>
