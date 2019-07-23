import pathToRegexp from 'path-to-regexp';
import { setAuthority } from './authority';
import { reloadAuthorized } from './Authorized';

/**
 * 格式化菜单数据结构，如果子菜单有权限配置，则子菜单权限优先于父级菜单的配置
 * 如果子菜单没有配置，则继承自父级菜单的配置
 * @param {Array} menuData
 * @param {String} parentPath
 * @param {string} parentAuthority
 */
function formatterMenuData(menuData, parentPath = '', parentAuthority) {
  return menuData.map((item) => {
    const { path } = item;
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatterMenuData(
        item.children,
        `${parentPath}${item.path}`,
        item.authority
      );
    }
    return result;
  });
}

/**
 * 将 Array 结构的 Menu 数据转化成以 path 为 key 的 Object 结构
 * 扁平化 Menu 数据，通过递归调用将父子层结构的数据处理为扁平化结构
 * @param {array} menuConfig
 *
 * eg：
 *  "/dashboard": {name: "dashboard", icon: "dashboard", path: "/dashboard", children: Array(3), authority: undefined}
 *  "/form": {name: "表单页", icon: "form", path: "/form", children: Array(3), authority: undefined}
 *  "/list": {name: "列表页", icon: "table", path: "/list", children: Array(4), authority: undefined}
 */
function getFlatMenuData(menuConfig) {
  let keys = {};
  menuConfig.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

/**
 *
 * @param {Array}  routerConfig
 * @param {Object} menuConfig
 */
function getRouterData(routerConfig, menuConfig) {
  const menuData = getFlatMenuData(formatterMenuData(menuConfig));

  const routerData = [];

  routerConfig.forEach((item, index) => {
    // 匹配菜单中的路由，当路由的 path 能在 menuData 中找到匹配（即菜单项对应的路由），则获取菜单项中当前 path 的配置 menuItem
    // eg.  router /product/:id === /product/123
    const pathRegexp = pathToRegexp(item.path);
    const menuKey = Object.keys(menuData).find((key) =>
      pathRegexp.test(`${key}`)
    );

    let menuItem = {};
    if (menuKey) {
      menuItem = menuData[menuKey];
    }

    let router = routerConfig[index];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };

    routerData.push(router);
  });

  return routerData;
}

// 获取当前时间 xx-xx-xx xx:xx:xx
function getNowFormatDate (va) {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
      month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
          + " " + date.getHours() + seperator2 + date.getMinutes()
          + seperator2 + date.getSeconds();
  if (va) return currentdate;
  return (date.getFullYear() + seperator1 + month + seperator1 + strDate);
}

// 时间戳转为日期 xx-xx-xx xx:xx:xx
function format (shijianchuo, va) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(parseInt(shijianchuo));
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  if (va) return (y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s));
  return (y+'-'+add0(m)+'-'+add0(d));
  function add0 (m) {return m<10 ? '0' + m : m }
}

// 日期转为时间戳
function toTimestamp (va) { // toTimestamp('2014-04-23 18:55:49:123') | toTimestamp('2014-04-23')
  var date = new Date(va);
  return date.getTime();
}

// 数字补0(2位)
function floatSev (num, vb) {
  let transNum = num == Infinity || num == NaN ? 0 : num;
  let leng = !vb || vb === 0 ? 100 : vb === 1 ? 10 : vb === 2 ? 100 : vb === 3 ? 1000 : vb === 4 ? 10000 : vb === 5 ? 100000 : vb === 6 ? 1000000 : vb === 7 ? 10000000 : vb === 8 ? 100000000 : vb === 9 ? 1000000000 : vb === 10 ? 10000000000 : false;
  if (leng === false) return new Error('保留小数不能超过10位！');
  let zwFractionVal = (transNum*leng).toFixed(0).toString();
  let tail = zwFractionVal.substring(zwFractionVal.length - (vb ? vb : 2));
  zwFractionVal = Math.floor(Number(zwFractionVal)/leng);
  let repair = !vb || vb === 0 ? '00' : vb === 1 ? '0' : vb === 2 ? '00' : vb === 3 ? '000' : vb === 4 ? '0000' : vb === 5 ? '00000' : vb === 6 ? '000000' : vb === 7 ? '0000000' : vb === 8 ? '00000000' : vb === 9 ? '000000000' : vb === 10 ? '0000000000' : false;
  if (repair === false) return new Error('保留小数不能超过10位！');
  return (zwFractionVal + '.' + (tail == '0' ? repair : tail));
}

// 按钮权限判断
function buttonJurisdictionIf (va, vb) {
  if (!va || !vb) return true;
  va = '/' + va.replace(/_/g, '/');
  vb = '/' + vb.replace(/_/g, '/');
  let temData = JSON.parse(decodeURI(window.localStorage.getItem('__login__after__CRM__menu__')));
  temData = temData && temData.jurisdictionMenu ? temData.jurisdictionMenu : false;
  if (!temData) return true;
  if (temData.code && temData.resourceTrees === null) return false;
  if (!temData.code && temData.resourceTrees === null) return true;
  // -----------------------------------------------------
  let menuTem = JSON.parse(JSON.stringify([temData]));
  let newMenuTem = [];
  while (menuTem.length) {
    let tem = menuTem.shift();
    if (!tem.resourceTrees || !tem.resourceTrees.length) {
      newMenuTem.push({
        code: tem.code, 
        parentCode: tem.parentCode == 'web' ? undefined : tem.parentCode ? tem.parentCode : undefined, 
        resourceTrees: tem.resourceTrees,
      });
    } else {
      tem.resourceTrees = tem.resourceTrees.map((item) => {
        item.parentCode = tem.code;
        return item;
      });
      menuTem.push({
        code: tem.code, 
        parentCode: tem.parentCode == 'web' ? undefined : tem.parentCode ? tem.parentCode : undefined, 
        resourceTrees: [],
      });
      menuTem.push(...tem.resourceTrees);
    }
  }
  newMenuTem = newMenuTem.map((item) => {
    item.code = '/' + item.code.replace(/_/g, '/');
    item.parentCode = item.parentCode ? ('/' + item.parentCode.replace(/_/g, '/')) : item.parentCode;
    return item;
  });
  let ifTrue;
  newMenuTem.forEach((item) => {
    if (item.code === va && item.resourceTrees === null) ifTrue = true;
    if (item.parentCode === va && item.code === vb) ifTrue = true;
  });
  if (ifTrue) return false;
  return true;
}
// #####################################################################
// 设置cookie
function setCookie (name, value, day) { // 当设置的时间没有时，不设置expires属性，cookie在浏览器关闭后删除
  if (day) {
    var expires = day * 24 * 60 * 60 * 1000;
    var date = new Date(+new Date()+expires);
    document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
  } else {
    document.cookie = name + "=" + escape(value);
  }
};
// 获取cookie
function getCookie (name) {
  var arr;
  var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
};
// 删除cookie
function delCookie (name) {
  setCookie(name, ' ', -1);
};
// 获取ticket
function getTicket () {
  let url = window.location.href;
  let token = url.match(/[\?&]ticket=[^&|\?]+/g);
  if (token) return token[0].replace(/(\?|&|(ticket=))/g, '');
  return '';
}
// 获取当前用户信息
function getUserInfo () {
  let temData = JSON.parse(decodeURI(window.localStorage.getItem('__login__after__CRM__menu__')));
  temData = temData && temData.accountInformation ? temData.accountInformation : {};
  return temData;
}
// 更新ticket登入信息
function updataUserInfo () {
  let token = window.localStorage.getItem('token') || '';
  let urlTem = '';
  let ifTrueA = (/&ticket=[^&]+&/g).test(window.location.href);
  let ifTrueB = (/&ticket=[^&]+$/g).test(window.location.href);
  let ifTrueC = (/\?ticket=[^&]+&/g).test(window.location.href);
  let ifTrueD = (/\?ticket=[^&]+$/g).test(window.location.href);
  if (ifTrueA) {
    urlTem = window.location.href.replace(/&ticket=[^&]+&/g, '&ticket=' + token + '&');
  } else if (ifTrueB) {
    urlTem = window.location.href.replace(/&ticket=[^&]+$/g, '&ticket=' + token);
  } else if (ifTrueC) {
    urlTem = window.location.href.replace(/\?ticket=[^&]+&/g, '?ticket=' + token + '&');
  } else if (ifTrueD) {
    urlTem = window.location.href.replace(/\?ticket=[^&]+$/g, '?ticket=' + token);
  } else {
    urlTem = window.location.href;
  }
  // --------------------------------------
  window.localStorage.setItem('__login__after__CRM__menu__', '');
  setAuthority('');
  reloadAuthorized();
  window.localStorage.setItem('token', '');
  delCookie('ticket');
  window.localStorage.setItem('__login__jump__CRM__url__', '');
  // ---------------------------------------
  let urlSub = urlTem.match(/\?[^#]+/g);
  window.location.href = urlTem.replace(/\?[^#]+/g, '') + (urlSub && urlSub.length > 0 ? urlSub[1] ? urlSub[1] : urlSub[0] ? urlSub[0] : '' : '');
}

export { getFlatMenuData, getRouterData, formatterMenuData, getNowFormatDate, format, toTimestamp, floatSev, buttonJurisdictionIf, setCookie, getCookie, delCookie, getTicket, getUserInfo, updataUserInfo, };
