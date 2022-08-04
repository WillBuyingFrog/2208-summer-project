// import Vue from 'vue'
// import Vuex from 'vuex'
// import user from "./user";

// Vue.use(Vuex)

// export default new Vuex.Store({
//     state: {
//     },
//     mutations: {
//     },
//     actions: {
//         clear({ commit }) {
//             commit("$_removeStorage");
//         }
//     },
//     modules: {
//         user
//     }
// })


import {createStore} from 'vuex'

export default createStore({
    actions:{

    },
    mutations:{

    },
    state:{
        user:{
            id:'',
            name:'',
            real_name:'',
            email:'',
            info:'',
        },
        teamid: '',
        project_id: '',
        project_name: '',
        file_name: '',
        file_id: ''
    },
    modules:{
        
    }
})
