<template >
    <h3>切换工作空间</h3>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom:30px;"
      :show-header="false">
      <el-table-column width="54">
        <template #default="scope">
            <el-avatar
                :size="32"
                shape="square"
                :style="randomRgb()"
                style="margin:0px 0 0 8px">
                    {{scope.row.team_name.slice(0,1)}} 
            </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="team_name" width="155">
      </el-table-column>
      <el-table-column>
        <template #default="scope">
            <el-button v-if="scope.row.team_id != this.$store.state.team_id" size="small"
                @click="enterTeam(scope.row.team_id)">进入团队</el-button>
            <el-tag v-else size="large">当前团队</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </template>

  <script>
    export default {
      created(){
        this.getList();
      }  ,
      data() {
        return {
          tableData: []
        }
      },
      methods: {
        randomRgb() {
            let R = Math.floor(Math.random() * 130+110);
            let G = Math.floor(Math.random() * 130+110);
            let B = Math.floor(Math.random() * 130+110);
            return {
                background: 'rgb(' + R + ',' + G + ',' + B + ', .5)'
            };
        },
        getList(){
            this.$http({
                method:'post',
                url:'/team/get/all',
            })
            .then(res =>{
                console.log(res.data);
                switch (res.data.code) {
                    case 200:
                        this.tableData = res.data.data;
                        break;
                }
            })
            .catch(err =>{
                console.log(err);
            })
        },
        enterTeam(id){
            this.$store.state.team_id = id
            if(this.$route.path == '/allproject'){
              this.$router.go(0);
            }else{
              this.$router.push({
                path:'/allproject',
                date:new Date().getTime()
            })
            }
        }

      },
      
    }
  </script>