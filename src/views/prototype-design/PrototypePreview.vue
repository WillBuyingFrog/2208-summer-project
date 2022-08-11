<template>
    <div class="bg"  v-if="isPreviewed == true">
    <el-container >
      <el-header style="border-bottom:0.5mm solid #e6e6e6;">
        <el-row >
            <el-col :span="2">
                    <span >
                        <img src="../../assets/images/logo.png" height="60"/>
                    </span>
                    <el-divider style="float:right;height:40px;margin-top:10px;margin-right:20px;" direction="vertical" />
                </el-col>
                <el-col :span="1">
                    <span style="font:600 22px ''; line-height:55px;">墨 书</span>
                </el-col>
            <el-col :span="18">
                <h2>{{name}}</h2>
            </el-col>
            <el-col :span="3">
                <el-button @click="toggleFullscreen" type="primary"
                 style="height:35px; margin-top:12px;">全屏预览</el-button>
            </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="300px" style="height:120vh;">
            <h4>页面（{{list.length}}）</h4>
            <el-divider></el-divider>
            <el-table :data="list" style="width: 100%;background-color:transparent;"
                :show-header="false"  row-style="background:transparent; height:50px"
                @row-click=change highlight-current-row="true">
                <el-table-column>
                    <template #default="scope">
                       <el-icon><CopyDocument /></el-icon>
                        <span style="font-size:15px; margin-left:10px"> {{scope.row.page_name}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-aside>
        <el-main style="background: #f6f6f6">
            <PreviewApp :previewPageId=page_id  id="img" class="preview" style="background:white"></PreviewApp>
        </el-main>
      </el-container>
    </el-container>
    </div>
</template>

<script>
import PreviewApp from './PreviewDesignApp.vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css'
export default{
    components:{
        PreviewApp
    },
    data(){
        return{
            name:'',
            list:[],
            page_id:'testtest',
            isPreviewed: false,
        }
    },
    methods: {
        change(row){
          console.log("Change page_id to", row.page_id)
           this.page_id = row.page_id;
        },
        toggleFullscreen() {
            if (screenfull.isEnabled) {
                const ele = document.getElementById('img');
                screenfull.toggle(ele)
            }
        },
        get(){
          const self = this;
          self.$http.post('/link/get', {
            link_id: this.$route.fullPath.split('=')[1]
          }).
          then(res=>{
            console.log(res.data)
            if(res.data.code == '200'){
                this.list = res.data.data.pageList
                this.name = res.data.data.prototype_name
                this.isPreviewed = true
                this.page_id = this.list[0].page_id
            }
            else{
                ElMessage.error('链接已失效！')
            }

          })
        }
    },
    created() {
        this.get()
    },

}

</script>


<style scoped>
.preview{
    margin-top: 3%;
    margin-left: 10%
}
</style>
