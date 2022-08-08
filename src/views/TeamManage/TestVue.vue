<template>
    <el-container>
      <el-header style="background: rgb(240,240,240);">
        <el-row >
            <el-col :span="2">
            <span style="float:left;margin-left:30px;"> <img src="../../assets/images/logo-1.png" height="58"/></span>    
            </el-col>
            <el-col :span="18">
                <h2>原型设计名字</h2>
            </el-col>
            <el-col :span="4">
                <el-button>全屏预览</el-button>
            </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="300px" style="background: rgb(240,240,240);height:100vh;">
            <h3>页面（{{list.length}}）</h3>
            <el-divider></el-divider>
            <el-table :data="list" style="width: 100%;background-color:transparent;" 
                :show-header="false"  row-style="background:transparent; height:50px">
                <el-table-column>
                    <template #default="scope">
                       <el-icon><CopyDocument /></el-icon>
                        <span style="font-size:15px; margin-left:10px"> {{scope.row.name}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-aside>
        <el-main>
            <el-image :src="list[0].url" style="height:630px;"></el-image>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default{
    data(){
        return{
            list:[{
                name:'首页',
                url:'https://img2.baidu.com/it/u=1792249350,650626052&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=675',
            },{
                name:'登录、注册页',
                url:'https://img2.baidu.com/it/u=2841427495,874700757&fm=253&fmt=auto&app=120&f=GIF?w=1017&h=800',
            },{
                name:'团队管理页',
                url:'https://img1.baidu.com/it/u=3969247811,1285706727&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
            },{
                name:'工作空间',
                url:'https://img0.baidu.com/it/u=1546227440,2897989905&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
            },{
                name:'个人信息',
                url:'https://img2.baidu.com/it/u=1061245231,4112198693&fm=253&fmt=auto&app=138&f=JPEG?w=438&h=340',
            }]
        }
    },
    // methods: {
    //     show(row){

    //     }
    // },
    // computed:{
    //     picture(){

    //     }
    // }
}

</script>


<style scoped>

</style>