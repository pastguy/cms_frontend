import {
  crawlStart_api,
  getCrawlProduct_api,
  getCrawlSku_api,
  downloadSkus_api,
} from '../../api/api_crawl/api_crawl.js';

export default {
  namespace: "crawl",
  state: {
    productPage: {},
    skuPage: {},
  },
  effects: {
    async crawlStart({ payload, callback }, { call, put }) {
      let res = await call(crawlStart_api, payload);
      if (!res || !res.data || !res.data.code || res.data.code != "200") {
        if (callback) {
          try {
            return callback(res.data.msg ? res.data.msg : "错误");
          } catch (e) {
            return callback("异常");
          }
        }
      }
      if (callback) callback();
    },
    async getCrawlProduct({ payload, callback }, { call, put }) {
      let res = await call(getCrawlProduct_api, payload);
      if (!res || !res.data || !res.data.code || res.data.code != "200") {
        if (callback) {
          try {
            return callback(res.data.msg ? res.data.msg : "错误");
          } catch (e) {
            return callback("异常");
          }
        }
      }
      put({
        type: 'setProductPage',
        payload: res.data,
      });
      if (callback) callback();
    },
    async getCrawlSku({ payload, callback }, { call, put }) {
      let res = await call(getCrawlSku_api, payload);
      debugger;
      if (!res || !res.data || !res.data.code || res.data.code != "200") {
        if (callback) {
          try {
            return callback(res.data.msg ? res.data.msg : "错误");
          } catch (e) {
            return callback("异常");
          }
        }
      }
      put({
        type: "setSkuPage",
        payload: res.data,
      });
      if (callback) callback();
    },
    async downloadSkus({ payload, callback }, { call, put }) {
      let res = await call(downloadSkus_api, payload);
      debugger
      const blob = new Blob([res.data]);
      let fileName = decodeURIComponent(res.headers["content-disposition"])
        .split(";")[2]
        .split("filename=")[1]
        .replace(/\"/g, "");
      // debugger
      fileName = fileName ? fileName : `${new Date().getTime()}xls`;
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
      if (callback) callback();
    },
  },

  reducers: {
    setProductPage(state, action) {
      return {
        ...state,
        productPage: action.payload.data
      };
    },
    setSkuPage(state, action) {
      return {
        ...state,
        skuPage: action.payload.data
      };
    },
  },
  subscriptions: {},
};
