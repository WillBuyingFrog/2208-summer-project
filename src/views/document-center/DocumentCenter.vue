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
              default-active="2"
              class="docs"
              @open="handleOpen"
              @close="handleClose"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><Folder /></el-icon>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group title="Group One">
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item one</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
                <el-menu-item index="1-4">item four</el-menu-item>
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

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import 'element-plus/dist/index.css'

export default {
  name: "DocumentCenter",
  data() {
    return {
      team_id: '',
      dialogVisible: false,
      dialogVisible1: false,
      allFile: [],
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

      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created(){
    this.team_id = this.$store.state.teamid;
    console.log("team_id: "+this.team_id);
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
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

</style>

<style>
.bg .el-menu-item.is-active{
  color: #859dda;
}
</style>