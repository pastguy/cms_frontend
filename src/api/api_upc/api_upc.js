import axios from 'axios';
import { stringify } from 'qs';
import { localHost } from '../../utils/config';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

export async function upcGen_api (params) {
  return axios({
    url: `${localHost}/upc/gen?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
export async function upcGenRetry_api (params) {
  return axios({
    url: `${localHost}/upc/gen/retry?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
export async function upcGenRecord_api (params) {
  return axios({
    url: `${localHost}/upc/gen/record?t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
export async function upcCodeRecord_api (params) {
  return axios({
    url: `${localHost}/upc/code/record?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
