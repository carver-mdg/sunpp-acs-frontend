import { boot } from 'quasar/wrappers'
import axios from 'axios'

// const api = axios.create({ baseURL: 'http://127.0.0.1:8000' })
const api = axios.create({ baseURL: 'http://192.168.1.8:8000' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
//   // something to do
// })


// import axios from 'axios';

// const axiosInstance = axios.create({ 
//   baseURL: 'http://127.0.0.1:8000' 
// });

// export default ({ Vue }) => {
//   Vue.prototype.$axios = axiosInstance;
// }

// export { axiosInstance }