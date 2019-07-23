import axios from 'axios';
import { Message, } from '@alifd/next'

axios.interceptors.request.use((config) => {
    config.headers.ticket = config.headers.ticket ? config.headers.ticket : window.localStorage.getItem('token') || '';
    config.headers.client_id = config.headers.client_id ? config.headers.client_id : 'ump';
    config.headers.client_type = config.headers.client_type ? config.headers.client_type : 'web';
    return config;
  }, (error) => {
    Message.error(error);
    return Promise.reject(error);
});

axios.interceptors.response.use((res) => {
  if (res && res.data && res.data.code && res.data.code !== 200 && res.data.msg) {
    Message.error(res.data.msg);
  } else if (res.data.code === 200) {
  } else {
  }
  return res;
}, (err) => {
  debugger
  if (err && err.response && err.response.data && err.response.data.code && err.response.data.code !== 200 && err.response.data.msg) {
    Message.error(err.response.data.msg);
  } else if (err.message == 'Network Error') {
    Message.error('网络错误！');
  } else {
    Message.error('未知错误！');
  }
  return Promise.reject(err);
});
