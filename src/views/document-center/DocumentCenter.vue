<template>
  <div class="bg">
    <el-container>
      <el-header style="padding: 0 0 ;">
        <TopGuide/>
      </el-header>
      <el-container>
        <el-aside
            width="300px"
            style="background-color: rgba(250, 250, 250, 0.6);"
        >
          <span></span>
          <el-icon
              style="padding: 20px 10px 0 0;font-size: 20px"
              @click="dialogVisible = true"
              class="newOne"
          ><FolderAdd /></el-icon>
          <el-dialog
              v-model="dialogVisible"
              width="35%">
            <template #header>
              <div class="card-header">
                <span class="title" style="margin-left: 10px; color: black">
                    <el-icon ><EditPen /></el-icon>新建文件夹
                </span>
              </div>
            </template>
            <el-form :model="newfolder" label-width="100px">
              <el-form-item label="文件夹名称">
                <el-input v-model="newfolder.name"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newFolder">立即创建</el-button>
        </span>
            </template>
          </el-dialog>
          <el-icon
              style="padding: 20px 0 0 10px;font-size: 20px"
              @click="dialogVisible1 = true"
              class="newOne"
          ><DocumentAdd /></el-icon>
          <el-dialog
              v-model="dialogVisible1"
              width="35%">
            <template #header>
              <div class="card-header">
                <span class="title" style="margin-left: 10px; color: black">
                    <el-icon ><EditPen /></el-icon>新建文档
                </span>
              </div>
            </template>
            <el-form :model="newfile" label-width="100px">
              <el-form-item label="文档标题">
                <el-input v-model="newfile.name"></el-input>
              </el-form-item>
              <el-form-item label="文档路径">
                <el-select v-model="newfile.route" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newFile">立即创建</el-button>
        </span>
            </template>
          </el-dialog>
          <el-menu
              default-active="activeIndex"
              class="docs"
              @select="handleSelect"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Folder /></el-icon>
                <span>项目文档区</span>
              </template>
              <el-menu-item-group
                  v-for="project in allProject"
                  :key="project.index"
                  :index="`1-${project.index}`"
                  :title="project.project_name"
              >
                <el-menu-item
                    v-for="(file,index) in project.file"
                    :key="file.file_id"
                    :index="`1-${project.index}-${index}`"
                >
                  <el-icon><Document /></el-icon>
                  <span>{{file.name}}</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu
                v-for="folder in allFolder"
                :key="folder.file_id"
                :index="folder.index"
            >
              <template #title>
                <el-icon><Folder /></el-icon>
                <span>{{folder.folder_name}}</span>
              </template>
              <el-menu-item
                  v-for="(file,index) in folder.file"
                  :key="file.file_id"
                  :index="`${folder.index}-${index}`"
              >
                <el-icon><Document /></el-icon>
                <span>{{file.name}}</span>
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item
                v-for="(file,index) in rootFile"
                :key="file.file_id"
                :index="`${index+folderNum}`"
            >
              <el-icon><Document /></el-icon>
              <span>{{file.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
<!--          <tip-tap-demo></tip-tap-demo>-->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import 'element-plus/dist/index.css'
import {ElMessage} from "element-plus";
// import TipTapDemo from "@/components/TipTapDemo";
function Folder(index, folder_id, folder_name) {
  this.index = index;
  this.folder_id = folder_id;
  this.folder_name = folder_name;
  this.file = [];
}
function Project(index, project_id, file_id, project_name) {
  this.index = index;
  this.project_id = project_id;
  this.file_id = file_id;
  this.project_name = project_name;
  this.file = [];
}
function Op(value, label) {
  this.value = value;
  this.label = label;
}
function File(type, file_id, id, name) {
  this.type = type;
  this.file_id = file_id;
  this.id = id;
  this.name = name;
}

export default {
  name: "DocumentCenter",
  // components: {TipTapDemo},
  data() {
    return {
      team_id: '',
      root_id: '',
      activeIndex: '',
      dialogVisible: false,
      dialogVisible1: false,
      allFile: [],
      allFolder: [],
      folderNum: 1,
      projectNum: 0,
      allProject: [],
      allProjectFile: [],
      allCommonFile: [],
      rootFile: [],
      routeOp: {
        value: '',
        label: ''
      },
      options: [{
        value: 'root',
        label: 'root'
      }],
      value: '',
      project: {
        index: 0,
        project_id: "",
        file_id: "",
        project_name: "",
        file: [],
      },
      folder: {
        index: 1,
        folder_id: "",
        folder_name: "",
        file: [],
      },
      newfile:{
        name: "",
        route: "",
        type: 0,
        project_id: "",
        parent_id: "",
      },
      newfolder:{
        name: "",
      },
    };
  },
  created(){
    this.team_id = this.$store.state.team_id;
    console.log("team_id: "+this.team_id);
    this.getAllFile();
  },
  methods: {
    getAllFile() {
      this.$http
          .post('/file/fileList', {
            team_id: this.team_id
          })
          .then(res =>{
            switch (res.data.code) {
              case 200:
                this.allFile = res.data.data;
                for (var i in this.allFile){
                  console.log('hi there');
                  if (this.allFile[i].type == 13) {
                    this.root_id = this.allFile[i].file_id;
                  }else if (this.allFile[i].type == 11) {
                    this.folderNum++;
                    var folder = new Folder(this.folderNum, this.allFile[i].file_id, this.allFile[i].name);
                    this.allFolder.push(folder);
                    var op = new Op(folder.folder_name, folder.folder_name);
                    this.options.push(op);
                  }else if (this.allFile[i].type == 12) {
                    this.projectNum++;
                    console.log(this.projectNum)
                    var pro = new Project(this.projectNum,this.allFile[i].id,this.allFile[i].file_id,this.allFile[i].name);
                    this.allProject.push(pro);
                    var op_pro = new Op("项目文档区/"+pro.project_name, "项目文档区/"+pro.project_name);
                    this.options.push(op_pro);
                  }else if (this.allFile[i].type == 0) {
                    for (var j in this.allProject) {
                      if (this.allProject[j].file_id == this.allFile[i].id) {
                        this.allProject[j].file.push(this.allFile[i]);
                        break;
                      }
                    }
                    this.allProjectFile.push(this.allFile[i]);
                  }else if (this.allFile[i].type == 2){
                    if (this.allFile[i].id == this.root_id){
                      this.rootFile.push(this.allFile[i]);
                    }else {
                      for (var k in this.allFolder) {
                        if (this.allFolder[k].folder_id == this.allFile[i].id) {
                          this.allFolder[k].file.push(this.allFile[i]);
                          break;
                        }
                      }
                    }
                    this.allCommonFile.push(this.allFile[i]);
                  }
                }
                this.project.index = 0;
                this.folder.index = 1;
                console.log(this.allFile);
                console.log(this.allFolder);
                console.log(this.allProject);
                console.log(this.allProjectFile);
                console.log(this.allCommonFile);
            }
          })
          .catch(err =>{
            console.log(err);
          })
    },
    newFolder() {
      var id = this.$store.state.user.id;
      if(id == undefined || id == null || id == ''){
        ElMessage.warning('请先登录');
      }else if(this.newfolder.name == '' || this.newfolder.name == null || this.newfolder.name == undefined){
        ElMessage.warning("请输入文件夹名称")
      }else {
        this.$http
            .post("/file/json/new",
                {
                  file_name: this.newfolder.name,
                  type: 11,
                  team_id: this.team_id,
                })
            .then(res => {
              // console.log(res.data.code);
              switch (res.data.code) {
                case 200:
                  ElMessage.success('创建成功！');
                  this.folderNum++;
                  var folder = new Folder(this.folderNum, res.data.data, this.newfolder.name);
                  this.allFolder.push(folder);
                  var op = new Op(folder.folder_name, folder.folder_name);
                  this.options.push(op);
                  this.newfolder.name = "";
                  // console.log(this.folder);
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  console.log(res.data.message);
                  break;
              }
            })
      }
    },
    newFile() {
      var id = this.$store.state.user.id;
      // console.log(this.newfile.name);
      if(id == undefined || id == null || id == ''){
        ElMessage.warning('请先登录');
      }else if(this.newfile.name == '' || this.newfile.name == null || this.newfile.name == undefined){
        ElMessage.warning("请输入文件名称")
      }else {
        // console.log(this.newfile.route);

        if(this.newfile.route.split('/')[0] == '项目文档区'){
          this.newfile.type = 0;
          var pro_name = this.newfile.route.split('/')[1];
          for (var i in this.allProject){
            if (this.allProject[i].project_name == pro_name) {
              this.newfile.project_id = this.allProject[i].project_id;
              break;
            }
          }
        } else{
          // console.log("type2");
          this.newfile.type = 2;
          if (this.newfile.route == 'root') {
            this.newfile.parent_id = this.root_id;
          } else {
            var par_name = this.newfile.route;
            for (var j in this.allFolder){
              // console.log(j);
              // console.log(this.allFolder[j]);
              // console.log(this.allFolder[j].folder_name);
              if (this.allFolder[j].folder_name == par_name) {
                this.newfile.parent_id = this.allFolder[j].folder_id;
                break;
              }
            }
          }
        }
        this.$http
            .post("/file/json/new",
                {
                  project_id: this.newfile.project_id,
                  file_name: this.newfile.name,
                  type: this.newfile.type,
                  parent_id: this.newfile.parent_id,
                })
            .then(res => {
              // console.log(res.data.code);
              switch (res.data.code) {
                case 200:
                  ElMessage.success('创建成功！');
                  console.log(this.newfile);
                  var file = new File(this.newfile.type, res.data.data,'', this.newfile.name);
                  // console.log(file);
                  if (this.newfile.type == 0){
                    for (var i in this.allProject){
                      if (this.allProject[i].project_id == this.newfile.project_id) {
                        file.id = this.allProject[i].file_id;
                        this.allProject[i].file.push(file);
                        break;
                      }
                    }
                  }else {
                    file.id = this.newfile.parent_id;
                    if (file.id == this.root_id) {
                      this.rootFile.push(file);
                    }else {
                      for (var j in this.allFolder){
                        if (this.allFolder[j].folder_id == file.id) {
                          this.allFolder[j].file.push(file);
                          break;
                        }
                      }
                    }
                  }
                  this.newfile.name = "";
                  this.newfile.parent_id = "";
                  this.newfile.project_id = "";
                  this.newfile.route = "";
                  this.newfile.type = 1;
                  // console.log("hi");
                  // console.log(this.allFolder);
                  break;
                case 500:
                  ElMessage.error(res.data.message);
                  console.log(res.data.message);
                  break;
              }
            })
      }
    },
  },
}

</script>

<style scoped>
.bg {
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
.docs {
  background-color: rgba(250, 250, 250, 0);
  height: 100vh;

}
.newOne :hover{
  color: #999999;
}

</style>

<style>
.bg .el-menu-item.is-active{
  color: #859dda;
}
</style>