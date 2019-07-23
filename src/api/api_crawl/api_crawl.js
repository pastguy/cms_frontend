import axios from 'axios';
import { stringify } from 'qs';
import { localHost } from '../../utils/config';

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

export async function crawlStart_api (params) {
  return axios({
    url: `${localHost}/crawl/start?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
export async function getCrawlProduct_api (params) {
  return axios({
    url: `${localHost}/crawl/product?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
export async function getCrawlSku_api (params) {
  debugger
  return axios({
    url: `${localHost}/crawl/sku?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}
export async function downloadSkus_api (params) {
  debugger;
  return axios({
    url: `${localHost}/crawl/download?${stringify(params)}&t=${Math.random()}`,
    method: 'get',
    headers: {
      ticket: window.localStorage.getItem('token') || '',
    },
  });
}

