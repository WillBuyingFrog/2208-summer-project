<template>
    <div class="project"></div>
</template>

<script>

export default {
    name: "oneProject",
    data() {
        return {
            dialogVisible: false,
            firstChar: "S",//用户名首字母
            team:{
                team_name: "团队名",
                leader: "someone",
                teammate:"123等",
                create_time: "2022/08/02 15:28",
                team_info: "小学期乱杀"
            },
            proNum: 4,//项目总数
            newone:{
                name: "",
                info: ""
            }
        }
    },
    methods: {
        newTeam(){
            this.dialogVisible = false;
        }
    }

}

</script>