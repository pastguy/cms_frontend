// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createHashHistory } from 'history';
import { updataUserInfo } from './utils/utils';
import './utils/request.js';

// 载入默认全局样式 normalize 、.clearfix 和一些 mixin 方法等
import '@alifd/next/reset.scss';
import './global.scss';

import router from './router';
import configureStore from './configureStore';

// Create redux store with history
const initialState = {};
const history = createHashHistory();
const store = configureStore(initialState, history);
const ICE_CONTAINER = document.getElementById('ice-container');

if (!ICE_CONTAINER) {
  throw new Error('当前页面不存在 <div id="ice-container"></div> 节点.');
}

// ---------------------------------------------------------------
window.addEventListener('hashchange', (e) => {
  let urlTem = window.location.href.match(/\/?\?[^#]+/g);
  let urlTemVal = urlTem && (urlTem.length > 0) ? urlTem[0] : '';
  if (e.newURL === `${location.protocol}//${location.host}/#/user${urlTemVal}`) {
    window.localStorage.setItem('__login__jump__url__', encodeURI(e.oldURL));
  }
});
// -----------------
var orignalSetItem = localStorage.setItem;
localStorage.setItem = function (key, newValue) {
  var setItemEvent = new Event("setItemEvent");
  setItemEvent.newValue = newValue;
  setItemEvent.key = key;
  window.dispatchEvent(setItemEvent);
  orignalSetItem.apply(this, arguments);
}
let tokenTem = '';
window.addEventListener("setItemEvent", function (e) {
  if (e.key === 'token') {
    if (tokenTem && e.newValue && (tokenTem !== e.newValue)) {
      updataUserInfo();
    }
    tokenTem = e.newValue;
  }
});

// ReactDOM.render(router, ICE_CONTAINER);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>{router()}</ConnectedRouter>
  </Provider>,
  ICE_CONTAINER
);
