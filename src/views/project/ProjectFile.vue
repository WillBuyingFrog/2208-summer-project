<template>
    <div class="projectfile">
        <el-row>
        <div class="button1" style="margin-left: 10%;">
            <el-button v-if="fileType == 1" color="#859dda" @click="dialogVisible = true">+新建</el-button>
            <el-button v-if="fileType == 0" color="#859dda" @click="dialogVisible2 = true">+新建</el-button>
        </div>
        </el-row>
    <div class="clear"></div>
    <!-- 新建原型表单 -->
    <el-dialog
        v-model="dialogVisible"
        width="60%">
        <template #header>
            <div class="card-header">
                <span class="title" style="margin-left: 10px; color: black">
                    <el-icon ><EditPen /></el-icon>新建原型
                </span>
            <div class="clear"></div>
            </div>
                </template>
        <!-- 新建原型表单 -->
        <el-form :model="newone" label-width="80px" v-if="fileType == 1">
            <el-form-item label="原型名称">
                <el-input v-model="newone.name" style="width: 400px;margin-left:15px"></el-input>
            </el-form-item>
            <el-form-item label="基础样式">
                <div class="paneChoose" v-for="(item, index) in paneList" :class="{'active':currentPane==index}" @click="choosePane(index)" :key="index">
                    <img class="paneimage" :src="item.imgsrc">
                    <!-- index < 3 -->
                    <div class="sub" v-if="index < 3">
                        <el-popover
                            placement="bottom"
                            :width="330"
                            trigger="click">
                            <template #reference>
                                <el-button link>{{item.subName[item.chosen]}}<el-icon><CaretBottom /></el-icon></el-button>
                            </template>
                            <el-table
                                :data="item.subName"
                                style="width: 100%;"
                                :show-header="false"
                                :row-class-name="rowClassName"
                                @row-click="(row,column,e)=>changeChosen(row,column,e,item)">
                                <el-table-column>
                                    <template #default="scope">
                                        <!-- -->
                                        {{item.subName[scope.$index] + '('+ item.width[scope.$index] + 'x' + item.height[scope.$index] +')'}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-popover>
                    </div>
                    <!-- index = 3 -->
                    <div v-if="index == 3">自定义</div>
                    <div v-if="index < 3" class="bottom">
                        {{item.width[item.chosen] + ' x ' + item.height[item.chosen]}}
                    </div>
                    <div v-else class="bottom">
                        <el-input style="width:45px;margin-right:4px" size="small" v-model="newone.w" placeholder="宽"></el-input>
                        <span> x </span>
                        <el-input style="width:45px;margin-left:4px" size="small" v-model="newone.h" placeholder="高"></el-input>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="选择模板">
                <div class="paneChoose" :class="{'active':currentDemo1==0}" @click="chooseDemo1(0)">
                    <div class="demoimage"></div>
                    <div class="modename" >空白原型</div>
                </div>
                <div class="paneChoose" v-for="(item, index) in demoList1" :class="{'active':currentDemo1==(index + 1)}" @click="chooseDemo1(index + 1)" :key="index">
                    <div class="demoimage">
                    <img>
                    <!--  src="imgsrcDemo1[index - 1]" -->
                    </div>
                    <div class="modename">{{item.template_name}}</div>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <span class="button1" style="margin-left:20px"><el-button @click="newFile" color="#859dda">立即创建</el-button></span>
        </span>
        </template>
    </el-dialog>
    <!-- 新建文档表单 -->
    <el-dialog
        v-model="dialogVisible2"
        width="60%">
        <template #header>
                    <div class="card-header">
                        <span class="title" style="margin-left: 10px; color: black">
                            <el-icon><Document /></el-icon>新建文档
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
         <el-form :model="newone" label-width="80px" v-if="fileType == 0">
            <el-form-item label="文档名称">
                <el-input v-model="newone.name" style="width: 400px;margin-left:15px"></el-input>
            </el-form-item>
            <el-form-item label="选择模板">
                <div class="paneChoose" :class="{'active':currentDemo0==0}" @click="chooseDemo0(0)">
                    <div class="demoimage"></div>
                    <div class="modename" >空白文档</div>
                </div>
                <div class="paneChoose" v-for="(item, index) in demoList0" :class="{'active':currentDemo0==(index + 1)}" @click="chooseDemo0(index + 1)" :key="index">
                    <div class="demoimage">
                    <img>
                    <!--  src="imgsrcDemo0[index - 1]" -->
                    </div>
                    <div class="modename" >{{item.template_name}}</div>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取消</el-button>
            <span class="button1" style="margin-left:20px"><el-button @click="newFile" color="#859dda">立即创建</el-button></span>
        </span>
        </template>
    </el-dialog>
    <el-dialog
        v-model="dialogVisible1"
        width="35%">
        <template #header>
                    <div class="card-header">
                        <span class="title" v-if="fileType == 1" style="margin-left: 10px; color: black">
                            <el-icon ><EditPen /></el-icon>重命名原型
                        </span>
                        <span class="title" v-if="fileType == 0" style="margin-left: 10px; color: black">
                            <el-icon><Document /></el-icon>重命名文档
                        </span>
                    <div class="clear"></div>
                    </div>
                </template>
        <el-form :model="newone" label-width="100px">
            <el-form-item label="新的文件名">
                <el-input v-model="newName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取消</el-button>
            <el-button type="primary" @click="renameFile">确定</el-button>
        </span>
        </template>
    </el-dialog>
    <el-space direction="vertical">
        <el-card class="box-card" v-if="allFile.length==0" style="width: 300px;">
            <el-empty description="暂无文件" />
        </el-card>
            <el-card v-for="file in allFile" :key="file.file_id" class="box-card" style="width: 900px">
                <div class="card-header">
                    <span class="pname">
                        <el-icon v-if="fileType == 1"><EditPen /></el-icon>
                        <el-icon v-if="fileType == 0"><Document /></el-icon>
                        <el-icon v-if="fileType == 2"><Picture /></el-icon>
                        {{file.file_name}}
                    </span>
                    <span class="button1">
                    <el-button size="small" color="#859dda" @click="editFile(file)">编辑</el-button>
                    <el-button size="small" color="#daad81" @click="openRename(file.file_id)">重命名</el-button>
                    </span>
                    <el-popconfirm title="确定要删除此文件?"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon-color="#7fa9cc"
                            @confirm="deleteFile(file.file_id)">
                        <template #reference>
                        <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <div class="clear"></div>
                <div class="clear"></div>
                </div>
            <div class="text item">
                <el-form :model="file" label-width="140px" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><Avatar /></el-icon> 创建者:</div>
                                </template>
                                <span>{{file.creator}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                                </template>
                                <span>{{file.create_time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><User /></el-icon> 最后编辑者:</div>
                                </template>
                                <span>{{file.last_modification_user}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span>{{file.last_modification_time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>
    </el-space>
    </div>
</template>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
import {level_initTemplateContents} from "@/views/prototype-design/utils/collaborate_level";
import {tiptap_createFromTemplate} from "@/components/scripts/collaborate_tiptap";
export default {
    name: "projectFile",
    data() {
        return {
            paneList: [
                {
                    name: 'phone',
                    subName: ['iPhone 13 Pro Max', 'iPhone 13 Pro/13',
                    'iPhone 11 Pro/X', 'iPhone 11/11 Pro Max', 'HUAWEI P40/小米CC9',
                    'HUAWEI Mate 40'],
                    imgsrc: require('../../assets/images/phone.jpg'),
                    width: ['428', '390', '375', '414 ','360', '360',],
                    height: ['926', '844', '812', '896', '780','792',],
                    chosenName: 'iPhone 13 Pro Max',
                    chosen: 0,
                },
                {
                    name: 'web',
                    subName: ['网页', '智能电视', 'MacBook Pro', 'iMac'],
                    imgsrc: require('../../assets/images/web.png'),
                    width: ['1440', '1920', '1440 ','1280'],
                    height: ['1204', '1080', '900', '720'],
                    chosenName: '网页',
                    chosen: 0,
                },
                {
                    name: 'pad',
                    subName: ['iPad mini', 'iPad Pro 11', 'iPad Pro 12.9'],
                    imgsrc: require('../../assets/images/pad.png'),
                    height: ['768', '834', '1024'],
                    width: ['1024', '1194', '1366'],
                    chosenName: 'iPad mini',
                    chosen: 0,
                },
                {
                    name:'自定义',
                    imgsrc: require('../../assets/images/add.jpg'),
                }

            ],
            currentPane: 1,//当前被选中的画布尺寸选项,index不等时 令=index
            currentDemo1: 0, //当前原型设计模板
            currentDemo0: 0, //当前文档模板
            team_id: '',
            project_name: '',
            project_id: '',
            fileType: "1",
            dialogVisible: false,
            dialogVisible1: false,
            dialogVisible2: false,
            allFile: [],
            newFileid: '',
            newName: '',
            nowfid: '',
            newone:{
                name: "",
                w: '1440',
                h: '1204',
                demo0_id: '',
                demo1_id: '',
            },
            imgsrcDemo0: [],//文档模板图片路径
            imgsrcDemo1: [],//原型模板图片路径
            demoList0: [],//文档模板
            demoList1: [],//原型模板
        }
    },
    watch:{
        //查询参数改变，再次执行数据获取方法
        '$route'(){
            this.fileType = this.$route.query.filetype;
            this.allFile = {};
            this.getFile();
        }
    },
    created(){
        this.fileType = this.$route.query.filetype;
        this.team_id = this.$store.state.team_id;
        this.project_name = this.$store.state.project_name;
        this.project_id = this.$store.state.project_id;
        console.log("test"+this.fileType);
        this.getFile();
        this.getAllDemo0();
        this.getAlllDemo1();
    },
    methods: {
        choosePane(index){
            this.currentPane = index;
            let i = this.paneList[index].chosen;
            this.newone.w = this.paneList[index].width[i];
            this.newone.h = this.paneList[index].height[i];
        },
        chooseDemo1(index){
            this.currentDemo1 = index;
            if(index > 0){
                this.newone.demo1_id = this.demoList1[index - 1].template_id;
            }else{
                this.newone.demo1_id = '';
            }
        },
        chooseDemo0(index){
            this.currentDemo0 = index;
            if(index > 0){
                this.newone.demo0_id = this.demoList0[index - 1].template_id;
            }else{
                this.newone.demo0_id = '';
            }
        },
        //获取原型模板
        getAlllDemo1(){
            this.$http
            .post('/template/viewProtoTemplate')
            .then(res =>{
                console.log(res.data.data);
                switch (res.data.code){
                    case 200:
                        console.log(res.data.data);
                        this.demoList1 = res.data.data;
                        break;
                    case 500:
                        ElMessage.error(res.data.message);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        //获取文档模板
        getAllDemo0(){
            this.$http
            .post('/template/viewDocTemplate')
            .then(res =>{
                console.log(res.data.data);
                switch (res.data.code){
                    case 200:
                        console.log(res.data.data);
                        this.demoList0 = res.data.data;
                        break;
                    case 500:
                        ElMessage.error(res.data.message);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        getFile(){
            if(this.fileType == 0 || this.fileType == 1){
                this.$http
                .post('/file/viewType', {
                    project_id: this.project_id,
                    type: this.fileType
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.allFile = res.data.data;
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
        //替换文件内容为模板，writeDoc表示写入文档，writeDesign表示写入原型;
        //content、pages为从后端拉取的模板的内容，为string类型，详见yapi文档
        //具体请求过程见demoToFile函数
        //新建的文件id:this.newFileid
        writeDoc(content){
            return content;//占位防报错，记得删
        },
        writeDesign(pages, width, height){
            return [pages, width, height];//占位防报错，记得删
        },
        //请求模板并写入文件，type:0表示文档 1表示原型；tid: 用于请求的模板的template_id
        demoToFile(type, tid){
            //文档
            if(type == 0){
                let content;
                //拉取模板
                this.$http
                .post('/template/getDocTemplate',{
                    template_id: tid
                })
                .then(res =>{
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            content = res.data.data.content;
                            //把模板内容写入文件
                            this.writeDoc(content);
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
            //原型
            else if(type == 1){
                let pages;
                let width;
                let height;
                //拉取模板
                this.$http
                .post('/template/getPrptoTemplate',{
                    template_id: tid
                })
                .then(res =>{
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            pages = res.data.data.pages;
                            width = res.data.data.template_width;
                            height = res.data.data.template_height;
                            this.writeDesign(pages, width, height);
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
        //新建文件
        newFile(){
            if(this.newone.name == '' || this.newone.name == null || this.newone.name == undefined){
                ElMessage.warning("请输入文件名");
            }
            //设计原型
            else if(this.fileType == 1 ){
              let prototype_id = null
              // 从模板创建原型设计，直接跳转到新的函数
              if(this.currentDemo1){
                this.$http
                .post('/template/newProto', {
                  template_id: this.currentDemo1.toString(),
                  project_id: this.project_id.toString(),
                  file_name: this.newone.name
                })
                .then(res => {
                  switch(res.data.code){
                    case 200:
                      prototype_id = res.data.data
                      console.log("New prototype id:", prototype_id)
                      console.log("Successfully created data from template No." + this.currentDemo1)
                      // 调用初始化内容的函数
                      level_initTemplateContents(this, prototype_id, this.currentDemo1)
                      this.getFile()
                      this.newone.name = '';
                      this.newFileid = res.data.data;
                      this.dialogVisible = false;
                      this.newone.w = '1440';
                      this.newone.h = '1204';
                      this.currentPane = 1;
                      this.currentDemo1 = 0;
                      this.newone.demo1_id = '';
                  }
                })
                return
              }
                this.$http
                .post('/file/json/new', {
                    project_id: this.project_id,
                    file_name: this.newone.name,
                    type: this.fileType,
                    height: this.newone.h,
                    width: this.newone.w
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("创建成功！")
                            this.newone.name = '';
                            this.newFileid = res.data.data;
                            this.dialogVisible = false;
                            this.newone.w = '1440';
                            this.newone.h = '1204';
                            this.currentPane = 1;
                            this.currentDemo1 = 0;
                            this.newone.demo1_id = '';
                            this.newFileid = res.data.data;
                            //不是选中空白模板，需要把模板写入文件
                            if(this.chooseDemo1 != 0){
                                this.demoToFile(1, this.newone.demo1_id);
                            }
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
            //文档
            else if(this.fileType == 0){
                this.$http
                .post('/file/json/new', {
                    project_id: this.project_id,
                    file_name: this.newone.name,
                    type: this.fileType
                })
                .then(async (res) =>{
                    console.log(res.data.code);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            // 如果是从模板创建的，那么此时还需要调用从模板创建文档的函数
                            if(this.currentDemo0 > 0){
                              // 先找到currentDemo0对应的template_id
                              let actualTemplateId = this.demoList0[this.currentDemo0 - 1].template_id
                              console.log(this.demoList0, this.demoList0[this.currentDemo0 - 1],
                                  this.demoList0[this.currentDemo0 - 1].template_id)

                              // eslint-disable-next-line no-unused-vars
                              let temp = await tiptap_createFromTemplate(this, res.data.data, actualTemplateId)
                            }
                            this.getFile();
                            ElMessage.success("创建成功！")
                            this.newone.name = '';
                            this.newFileid = res.data.data;
                            this.dialogVisible2 = false;
                            this.currentDemo0 = 0;
                            this.newone.demo0_id = '';
                            if(this.chooseDemo0 == 0){
                                this.demoToFile(0, this.newone.demo0_id);
                            }
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
        deleteFile(fileid){
            //原型设计,文档
            if(this.fileType == 1 || this.fileType == 0){
                this.$http({
                    method:'post',
                    url:'/file/json/delete',
                    params: {
                        file_id: fileid,
                    },
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("删除成功！")
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
            //绘制图
            else if(this.fileType == 2){
                this.$http({
                    method:'post',
                    url:'/file/json/delete',
                    params: {
                        file_id: fileid,
                    },
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("删除成功！")
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
        openRename(fileid){
            this.dialogVisible1 = true;
            this.nowfid = fileid;
            console.log(this.nowfid);
        },
        renameFile(){
            if(this.fileType == 1 || this.fileType == 0){
                this.$http({
                    method:'post',
                    url:'/file/json/update',
                    params: {
                        file_id: this.nowfid,
                        file_name: this.newName
                    },
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.getFile();
                            ElMessage.success("重命名成功！")
                            this.newName = '';
                            this.dialogVisible1 = false;
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
        editFile(file){
            this.$store.state.file_name = file.file_name;
            this.$store.state.file_id = file.file_id;
            this.$store.state.file_index = file.index;
            console.log("Ready to edit prototype", this.$store.state.file_id)
            localStorage.setItem('file_id', this.$store.state.file_id)
            localStorage.setItem('file_name', this.$store.state.file_name)
            localStorage.setItem('file_index', this.$store.state.file_index)
            localStorage.setItem('user_name', this.$store.state.user.name)
            localStorage.setItem('user_id', this.$store.state.user.id)
            localStorage.setItem('project_id', this.$store.state.project_id)
            console.log(file.index);
            console.log(this.$store.state.file_index);
            if(this.fileType == 1){
               let routeUrl = this.$router.resolve({
                 path: "/prototypeDesign",
               });
               window.open(routeUrl.href, "_blank");
               // this.$router.push('/prototypeDesign');
            }
            else if(this.fileType == 0){
                let routeUrl = this.$router.resolve({
                    path: "/documentEdit",
                });
                window.open(routeUrl.href, "_blank");
                //this.$router.push('/documentEdit');
            }

        },
        changeChosen(row, column, e, item){
            let i;
            i = column;
            i = e;
            for(i = 0; i < item.subName.length; i++){
                if(item.subName[i] == row){
                    item.chosen = i;
                    break;
                }
            }
            this.newone.w = item.width[item.chosen];
            this.newone.h = item.height[item.chosen];
            console.log(item.subName[item.chosen]);
        },
    }

}

</script>

<style scoped>
.el-space {
    margin-left: 10%;
    margin-right: 5%;
}
.title{
    width: 120px;
    margin-left: 50px;
    margin-top: 20px;
    padding-bottom: 5px;
    font-size: 20px;
    color: #859dda;
    border-bottom:4px solid  #859dda;
    font-weight: 600;
    float: left;
    }
.el-card {
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
    margin-top:20px;
}
.el-form {
    padding-left: 12px;
    padding-right: 12px;
    padding-top:5px
}
.el-row{
    height: 30px;
}
.pname{
    font-size: 18px;
    float: left;
    font-weight: 520;
}
.clear{
    clear: both;
}
.card-header .el-button{
    float: right;
    margin-right: 20px;
}
.card-header{
    border-bottom: 1px solid #D3D3D3;
    padding-bottom: 6px;
}
.paneChoose {
    margin-left: 15px;
    margin-right: 10px;
    width: 160px;
    height: 150px;
    border-radius: 1ch;
    border: 2px solid #D3D3D3;
    margin-bottom: 10px;
}
.active {
    border-color: #859dda;
}
.paneimage{
    height: 50px;
    margin-top:25px
}
.button1 .el-button{
    color: white;
}
.demoimage {
    width: 160px;
    height: 115px;
    border-radius: 1ch 1ch 0 0;
    border-bottom: 1px solid #D3D3D3;
}
.modename {
    width: 160px;
    overflow:hidden; /*溢出的部分隐藏*/
  white-space: nowrap; /*文本不换行*/
  text-overflow:ellipsis;/*ellipsis:文本溢出显示省略号（...）*/
}
</style>

