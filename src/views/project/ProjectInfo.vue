<template>
    <div>
        <el-card class="box-card" style="width: 800px">
            <template #header>
                <div class="card-header">
                    <span class="pname">
                        <el-icon><Paperclip /></el-icon>
                        项目信息
                    </span>
                <div class="clear"></div>
                </div>
            </template>
            <div class="text item">
                <el-form :model="project" label-width="140px" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Collection /></el-icon> 项目名称:</div>
                                </template>
                                <span>{{project.project_name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><DocumentCopy /></el-icon> 所属团队:</div>
                                </template>
                                <span>{{project.team_name}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Avatar /></el-icon> 创建者:</div>
                                </template>
                                <span>{{project.creator}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 创建时间:</div>
                                </template>
                                <span>{{project.create_time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><User /></el-icon> 最后编辑者:</div>
                                </template>
                                <span>{{project.last_modification_user}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><Timer /></el-icon> 最后编辑时间:</div>
                                </template>
                                <span>{{project.last_modification_time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item>
                                <template #label>  
                                    <div class="label1"><el-icon><CollectionTag /></el-icon> 项目简介:</div>
                                </template>
                                <span>{{project.project_info}}</span>
                            </el-form-item>
                    </el-row>   
                    <div class="button1" v-if="status == 0">
                        <el-button type="primary" @click="rename">重命名</el-button>
                        <el-button type="danger" @click="deletePro">删&nbsp;除</el-button> 
                    </div>  
                    <div class="button1" v-if="status == 1">
                        <el-button type="danger" @click="recover">恢&nbsp;复</el-button>    
                    </div>                                      
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'
export default {
name: "projectFile",
    data() {
        return {
            dialogVisible: false,
            team_id: '',
            project_name: '',
            project:{},
            newone:{
                name: "",
                info: ""
            }
        }
    },
    created(){
        this.team_id = this.$store.state.team_id;
        this.project_name = this.$store.state.project_name;
        this.getProject();
    },
    methods: {
        getProject(){
            this.$http
                .post('/project/viewProject', {
                    project_name: this.project_name,
                    team_id: this.team_id
                })
                .then(res =>{
                    console.log(res.data.code);
                    console.log(res.data.data);
                    switch (res.data.code){
                        case 200:
                            console.log(res.data.data);
                            this.project = res.data.data;
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
    }

}
</script>

<style scoped>
.el-card {
    background-color: rgba(255, 255, 255, 0.62);
    border-radius: 1ch;
    box-shadow: 14px 15px 19px -15px #000;
    margin-top:20px;
    margin-left: 15%;
}
.el-form{
    margin-left: 20px;
    margin-right: 20px;
}
</style>