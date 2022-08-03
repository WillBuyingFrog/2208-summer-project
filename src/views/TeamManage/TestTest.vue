<template>
    <div>
        <h1>111</h1>
          <el-avatar :style="randomRgb()"> {{name.slice(0,1)}} </el-avatar>
    </div>
</template>


<script>
export default{
    data(){
        return{
            name:'dhy'
        }
    },
    methods: {
        randomRgb() {
               let R = Math.floor(Math.random() * 130+110);
                let G = Math.floor(Math.random() * 130+110);
                let B = Math.floor(Math.random() * 130+110);
                console.log(R,G,B)
                return {
                    background: 'rgb(' + R + ',' + G + ',' + B + ', .5)'
                };
            },
    }

}
</script>

