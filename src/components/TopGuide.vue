<template >
    <div style="background-color:rgba(32,80,111,0.6);">
<!--  <div>-->
        <el-row >
            <el-col :span="4">
            <span style="float:left;margin-left: 30px;"> <img src="../assets/images/logo-1.png" height="58"/></span>    
            </el-col>
            <el-col :span="6">
                <el-menu
                    :default-active="activePath"
                    class="el-menu-demo"
                    style="background:unset"
                    mode="horizontal"
                    :ellipsis="false"
                    text-color="rgb(210,228,245)"
                    active-text-color="rgb(210,228,245)"
                    @select="handleSelect"
                    router>
                    <el-menu-item index="/allproject" class="item">
                        <el-icon><DataLine/></el-icon>
                        <span style="font-size: 16px;">项目管理</span>
                    </el-menu-item>
                    <el-menu-item index="/team" style="margin-left:80px">
                        <el-icon><Coordinate/></el-icon>
                        <span style="font-size: 16px;">团队管理</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="3" :offset="7">
                <el-menu
                    class="space"
                    style="background:unset;"
                    mode="horizontal"
                    text-color="rgb(210,228,245)"
                    router>
                    <el-menu-item index="/workspace" style="padding:0 0 ;">
                        <el-icon><Menu/></el-icon>
                        <span
                            style="font-size: 16px;">工作空间</span>
                    </el-menu-item>
                </el-menu>    
            </el-col>
            <el-col :span="1" >
                 <el-badge :value="12" class="item" style="margin-top:15px;">
                    <el-button icon="ChatDotRound">消息</el-button>
                </el-badge>
            </el-col>
            <el-col :span="1">
                <el-popover
                    placement="bottom"
                    :width="200"
                    trigger="click">
                  <template #reference>
                    <el-avatar :style="{background:avatarColor}" :size="36" 
                     style="margin-top:12px;margin-left: 15px;"> 
                    {{this.$store.state.user.name.slice(0,1)}} 
                    </el-avatar>
                  </template>
                  <UserInfo :avatarColor="avatarColor"></UserInfo>
                </el-popover>
            </el-col>
        </el-row>
    </div>
</template>


<style scoped>
  .space{
    border-bottom: 0;
  }
  .item {

  }
  .item :hover {
    color: rgb(32,80,111);
    background-color: rgba(255,255,255,0.3);
  }
</style>
<script>
import UserInfo from "@/views/account/UserInfo";
export default {
  components: {UserInfo},
  data(){
    return{
        avatarColor:''
    }
  },
  created(){
    let R = Math.floor(Math.random() * 130+110);
    let G = Math.floor(Math.random() * 130+110);
    let B = Math.floor(Math.random() * 130+110);
    this.avatarColor = 'rgb(' + R + ',' + G + ',' + B + ', .5)'
  },
   computed:{
    activePath(){ 
      if(this.$route.path.split('/')[1] == 'team')
      return '/team' 
      else
      return '/allproject'
    }
  },
  methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
  }
}
</script>