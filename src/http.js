import axios from 'axios'
import store from './redux/store'

axios.defaults.baseURL = 'http://localhost:3006'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  store.dispatch({ type: 'loading',payload:true })
  return config;
}, function (error) {
  store.dispatch({ type: 'loading',payload:false })
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  store.dispatch({ type: 'loading' ,payload:false})
  return response;
}, function (error) {
  store.dispatch({ type: 'loading',payload:false })
  return Promise.reject(error);
});