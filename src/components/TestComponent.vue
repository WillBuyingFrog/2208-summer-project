<template>
   <section>
      <input type="text" v-model="search">
      <ul>
         <li v-for="(p,index) in filterPersons" :key="index">
            {{index}}--{{p.name}}--{{p.age}}
         </li>
      </ul>
      <button @click="setorderType(0)">年龄升序</button>
      <button @click="setorderType(1)">年龄降序</button>
      <button @click="setorderType(2)">名字排序</button>
   </section>
 
</template>
<script>
    export default {
        data() {
           return{
               persons:[
                   {name:'Tom',age:18},
                   {name:'Jack',age:16},
                   {name:'Bob',age:19},
                   {name:'Rose',age:17},
               ] ,
               search:'',
               orderType:0,//0升序 ，1降序，2名字
           }
        },
        computed:{
            filterPersons(){
                const {search,persons ,orderType}=this
                let fPersons;
                fPersons=persons.filter(p => p.name.toLowerCase().indexOf(search.toLowerCase())!==-1)
                    fPersons.sort(function(x,y){
                        //1降序
                        if(orderType===1){
                            return y.age-x.age;
                        }else if(orderType == 0){//0升序
                                return x.age-y.age
                        }else if(orderType == 2){//2名字排序
                                return x.name.localeCompare(y.name)
                        }
                    })
                return fPersons;
            }
        },
        methods:{
            setorderType(ordert){
                this.orderType=ordert
                this.try();
            },
            try(){
                let chineseAndEngAndNumber = ['应用','zoo','服务器','banana','pear','start','张三','蓝天','随便什么吧']
 chineseAndEngAndNumber.sort((x,y)=>{
   let reg = /[a-zA-Z0-9]/
    if(reg.test(x)|| reg.test(y)){
       if(x>y){
           return 1
       }else if(x<y){
           return -1
       }else{
           return 0
       }
            }else{
            return x.localeCompare(y)
            }
        })
        console.log(chineseAndEngAndNumber);
            }
            
        },
    }
 
</script>