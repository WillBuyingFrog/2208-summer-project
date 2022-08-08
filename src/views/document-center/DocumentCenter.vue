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
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="newFolder">立即创建</el-button>
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
                  {{file.name}}
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
                <span>{{folder.name}}</span>
              </template>
              <el-menu-item
                  v-for="(file,index) in allCommonFile"
                  :key="file.file_id"
                  :index="`${folder.index}-${index}`"
              >
                {{file.name}}
              </el-menu-item>

            </el-sub-menu>
            <el-menu-item index="2">
              <el-icon><Document /></el-icon>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><Document /></el-icon>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><Document /></el-icon>
              <span>Navigator Four</span>
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
// import TipTapDemo from "@/components/TipTapDemo";

export default {
  name: "DocumentCenter",
  // components: {TipTapDemo},
  data() {
    return {
      team_id: '',
      activeIndex: '',
      dialogVisible: false,
      dialogVisible1: false,
      allFile: [],
      allFolder: [],
      allProject: [],
      allProjectFile: [],
      allCommonFile: [],
      project:{
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
        router: "",
      },
      newfolder:{
        name: "",
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',

    };
  },
  created(){
    this.team_id = this.$store.state.team_id;
    console.log("team_id: "+this.team_id);
    this.getAllFile();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    getAllFile() {
      this.$http
          .post('/file/fileList', {
            team_id: this.team_id
          })
          .then(res =>{
            console.log(res.data);
            console.log(res.data.data.length);
            switch (res.data.code) {
              case 200:
                this.allFile = res.data.data;
                for (var file in this.allFile){
                  if (file.type == 11) {
                    this.folder.index++;
                    this.folder.folder_id = file.file_id;
                    this.folder.folder_name = file.name;
                    this.allFolder.push(this.folder);
                  }else if (file.type == 12) {
                    this.project.index++;
                    this.project.project_id = file.id;
                    this.project.project_name = file.name;
                    this.project.file_id = file.file_id;
                    this.allProject.push(this.project);
                  }else if (file.type == 0) {
                    for (var pro in this.allProject) {
                      if (pro.file_id == file.id) {
                        pro.file.push(file);
                        break;
                      }
                    }
                    this.allProjectFile.push(file);
                  }else if (file.type == 2){
                    for (var folder in this.allFolder) {
                      if (folder.folder_id == file.id) {
                        folder.file.push(file);
                        break;
                      }
                    }
                    this.allCommonFile.push(file);
                  }
                }
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

    },
    newFile() {

    }


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