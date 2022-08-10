<template>
  <div class="document-bg">
    <div class="bg-plus">
      <el-container class="outer-container">
        <el-header height="60px" class="header">
          <el-row>
            <el-col :span="1">
              <div class="logo">
                <img src="../../assets/images/logo-1.png" height="60">
              </div>
            </el-col>
            <el-col :span="22">
              <p class="name">
                {{this.doc_name}}
                <el-icon class="edit-icon" @click="dialogVisible=true"><Edit></Edit></el-icon>
              </p>
              <el-dialog
                  v-model="dialogVisible"
                  width="35%">
                <template #header>
                  <div class="card-header">
                    <span class="title" style="margin-left: 10px; color: black">
                        <DocumentCopy style="width: 0.8em; height: 0.8em;"/>
                        重命名文档
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
              <el-button
                  class="drawer-btn"
                  color="#859dda"
                  :dark="isDark"
                  plain
                  text @click="drawer = true">
                <el-icon class="drawer-icon"><Fold /></el-icon>
                文档列表
              </el-button>
              <el-drawer
                  v-model="drawer"
                  title="全部文档"
                  direction="rtl"
                  size="30%">
                <el-menu
                    :default-active="activeIndex"
                    class="all-docs"
                    @select="handleSelect"
                    text-color="#000000"
                    active-text-color="#409EFF">
                  <el-menu-item
                      v-for="doc in allDocs"
                      :key="doc.file_id"
                      :index="doc.index"
                      @click="toggle(doc)"
                  >{{doc.file_name}}</el-menu-item>
                  <el-menu-item @click="newDoc">
                    <el-icon><Plus /></el-icon>
                  </el-menu-item>
                </el-menu>
              </el-drawer>
            </el-col>
          </el-row>
        </el-header>
        <el-main class="mainPane">
          <div class="tiptap">
            <TipTapDemo :file-id="file_id" :file-name="doc_name"></TipTapDemo>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
//import { InfoFilled } from '@element-plus/icons-vue';
// import QuillTest from "@/components/QuillTest";
import {ElMessage} from "element-plus";
import TipTapDemo from "@/components/TipTapDemo";
//import {ElMessage} from "element-plus";
export default {
  name: "DocumentEdit",
  components: {TipTapDemo},
  data() {
    return {
      project_id: '',
      file_id: '',
      doc_name: '',
      drawer: false,
      dialogVisible: false,
      allDocs: [],
      docNum: 1,
      newOneIndex: '',
      activeIndex: '1',
      newname: '',
    }
  },
  created(){
    this.$store.state.file_id = localStorage.getItem('file_id');
    this.$store.state.file_name = localStorage.getItem('file_name');
    this.$store.state.file_index = localStorage.getItem('file_index');
    this.$store.state.user.name = localStorage.getItem('user_name');
    this.$store.state.user.id = localStorage.getItem('user_name');
    this.$store.state.project_id = localStorage.getItem('project_id');

    this.project_id = localStorage.getItem('project_id');
    this.file_id = localStorage.getItem('file_id');
    this.index = localStorage.getItem('file_index');
    // console.log(this.project_id);
    // console.log(this.file_id);
    // console.log(this.index);
    this.getAllDocs(this.file_id);
    // console.log('hi');
  },
  methods: {
    rename(){
      if(this.newame == '' || this.newname == null || this.newname == undefined){
        ElMessage.warning("新标题不能为空")
      }else{
        this.$http({
          method:'post',
          url:'/file/json/update',
          params: {
            file_id: this.file_id,
            file_name: this.newname
          },
        })
        .then(res =>{
          console.log(res.data.code);
          console.log(res.data.data);
          switch (res.data.code){
            case 200:
              this.getAllDocs(this.index);
              ElMessage.success("重命名成功!");
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
    getAllDocs(file_id){
          this.$http
              .post('/file/viewType', {
                project_id: this.project_id,
                type: "0",
              })
              .then(res =>{
                // console.log(res.data);
                // console.log(res.data.data.length);
                // console.log(res.data.data[0].file_name);
                switch (res.data.code) {
                  case 200:
                    this.allDocs = res.data.data;
                    this.allDocs.sort(function (a,b) {
                      return(a.index-b.index);
                    });
                    console.log(this.allDocs);
                    this.docNum = this.allDocs.length;
                    this.newOneIndex = this.docNum + 1;
                    var index;
                    for (var i in this.allDocs) {
                      if (this.allDocs[i].file_id == file_id) {
                        index = this.allDocs[i].index;
                        break;
                      }
                    }
                    this.activeIndex = index;
                    console.log(index);
                    this.doc_name = this.allDocs[index-1].file_name;
                    this.file_id = this.allDocs[index-1].file_id;
                    break;
                }
              })
              .catch(err =>{
                console.log(err);
              })
    },

    newDoc(){
      var id = this.$store.state.user.id;
      if(id == undefined || id == null || id == ''){
        ElMessage.warning('请先登录');
      }
      else {
        this.$http
            .post("/file/json/new",
                {
                  project_id: this.project_id,
                  file_name: "文档"+ this.newOneIndex,
                  type: 0
                })
            .then(res => {
              console.log(res.data.code);
              switch (res.data.code) {
                case 200:
                  this.getAllDocs(res.data.data);
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
    toggle(doc){
      this.doc_name = doc.file_name;
      this.index = doc.index;
      this.activeIndex = doc.index;
      this.file_id = doc.file_id;
      console.log("toggle");
      console.log(this.activeIndex);
      // 标题和内容更改
    },
  }
}
</script>

<style scoped>
.document-bg {
  background-image: url("../../assets/images/sign-bg.jpg");
  background-repeat: repeat-y;
  min-height: 800px;
  background-position:center;
  background-size: 100% auto;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.bg-plus {
  /*background-color: rgba(255, 255, 255, 0.50);*/
  min-height: 800px;
  overflow: auto;
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
.drawer-btn {
  float: right;
  margin: 15px 0 0 0;
  box-shadow: 3px 3px 10px #859dda;
  border-radius: 30px;
}
.button2 .el-button{
  color: white;
}

.mainPane {
  margin: 20px 20px 0 20px;
  padding: 0;
  height: 95%;
}
.tiptap {
  height: 100%;
}
</style>
