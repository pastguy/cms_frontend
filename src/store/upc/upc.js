import {
  upcGen_api,
  upcGenRecord_api,
  upcGenRetry_api,
  upcCodeRecord_api,
} from '../../api/api_upc/api_upc.js';

export default {
  namespace: "upc",
  state: {
    upcGenPage: {},
    upcCodes: [],
  },
  effects: {
    async upcGen({ payload, callback }, { call, put }) {
      let res = await call(upcGen_api, payload);
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
    async upcGenRetry({ payload, callback }, { call, put }) {
      let res = await call(upcGenRetry_api, payload);
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
    async getUpcGenPage({ payload, callback }, { call, put }) {
      let res = await call(upcGenRecord_api, payload);
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
        type: "setUpcGenPage",
        payload: res.data,
      });
      if (callback) callback();
    },
    async getUpcCode({ payload, callback }, { call, put }) {
      let res = await call(upcCodeRecord_api, payload);
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
        type: "setUpcCode",
        payload: res.data,
      });
      if (callback) callback();
    },
  },

  reducers: {
    setUpcGenPage(state, action) {
      return {
        ...state,
        upcGenPage: action.payload.data
      };
    },
    setUpcCode(state, action) {
      return {
        ...state,
        upcCodes: action.payload.data
      };
    },
  },
  subscriptions: {}
};
