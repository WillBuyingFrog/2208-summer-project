<template>
    <div>
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
        width="35%">
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
                <el-input v-model="newone.name"></el-input>
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
                        <span class="title" v-if="fileType == 2" style="margin-left: 10px; color: black">
                            <el-icon><Picture /></el-icon>重命名图
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
                    <el-button size="small" color="#859dda" @click="editFile(file.file_id, file.file_name)">编辑</el-button>
                    <el-button size="small" color="#daad81" @click="openRename(file.file_id)">重命名</el-button>
                    </span>
                    <el-popconfirm title="确定要删除此文件?" @confirm="deleteFile(file.file_id)">
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
            pwidth: '',
            pheight: '',
            currentPane: 1,//当前被选中的画布尺寸选项,index不等时 令=index
            isActive: false,//index相等时,判断isActive是否为true，如果为true ，isActive为false，如果是false则为true
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
                h: '1204'
            }
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
        this.team_id = this.$store.state.team_id;
        this.project_name = this.$store.state.project_name;
        this.project_id = this.$store.state.project_id;
        console.log(this.fileType);
        this.getFile();
    },
    methods: {
        choosePane(index){
            if(this.currentPane == index){
                this.isActive = !this.isActive;
            }
            else{
                this.isActive = true;
            }
            this.currentPane = index;
        },
        getFile(){
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
        },
        newFile(){
            if(this.newone.name == '' || this.newone.name == null || this.newone.name == undefined){
                ElMessage.warning("请输入文件名");
            }
            //设计原型、文档
            else if(this.fileType == 1 || this.fileType == 0){
                this.$http
                .post('/file/json/new', {
                    project_id: this.project_id,
                    file_name: this.newone.name,
                    type: this.fileType
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
                            this.dialogVisible2 = false;
                            //是否跳转到编辑页？
                            // this.$router.push('/prototypeDesign');
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
        editFile(id, name){
            this.$store.state.file_name = name;
            this.$store.state.file_id = id;
            console.log(this.$store.state.file_id);
            if(this.fileType == 1){
                let routeUrl = this.$router.resolve({
                    path: "/prototypeDesign",
                });
                window.open(routeUrl.href, "_blank");
                //this.$router.push('/prototypeDesign');
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
</style>
