/* eslint-disable no-restricted-syntax,guard-for-in,import/prefer-default-export */

/**
 * 尊宝一些公用方法
 */

import axios from 'axios';

/*
************************************* 获取尊宝本地缓存 开始 *****************************************
*/
// 返回的结果需要解码 JSON.parse(decodeURIComponent(result))
export function readLocalDataZB(key) {
  return axios({
    timeout: 10000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: `/reqreadfile?filename=${key}`,
    method: 'GET',
  });
}
/* ********************************* 获取尊宝本地缓存 结束 *************************************** */

/*
************************************* 存入尊宝的本地缓存 开始 *******************************************
*/
export function saveLocalDataZB(quary) {
  const options = {
    url: `/reqsavefile?filename=${quary.key}`,
    method: 'POST',
    data: encodeURIComponent(JSON.stringify(quary.object)),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 3000,
  };

  return axios(options)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    });
}
/* ********************************* 存入尊宝的本地缓存 结束 **************************************** */

/*
************************************* 获取用户信息 开始 *******************************************
*/
export function getUserInfo() {
  const obj = {
    action: 5702,
    JAction: 48913,
    MobileCode: '($MobileCode)',
    // 请求标识
    Reqno: new Date().getTime(),
    // 请求服务器标识
    Reqlinktype: 1,
  };

  const params = new URLSearchParams();

  for (const x in obj) {
    params.append(x, obj[x]);
  }

  const options = {
    url: '/reqxml',
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      tztWebdataEncrypt: 1,
    },
    timeout: 3000,
  };

  return axios(options)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    });
}
/* ********************************* 获取尊宝的用户信息 结束 **************************************** */

/*
*********************************** 获取当前平台，如android、iOS 开始 *****************************************
*/
export function getPlatform() {
  let platform = false;
  const system = window.navigator.appVersion.toLocaleLowerCase();
  if (system.indexOf('iphone; cpu iphone') > 0) {
    platform = true;
  }
  return platform;
}
/* ********************************* 获取当前平台，如android、iOS） 结束 ************************************ */

/*
***********************************  返回上一页 开始 *****************************************
*/
export function goBackPage() {
  switch (window.News_CURRENT_ENV) {
    case 'ZUN_BAO_ENV':
      window.location.href = 'http://action:10002/';
      break;
    case 'LOCAL_ENV':
      window.history.go(-1);
      break;
    default:
      break;
  }
}
/* ********************************* 返回上一页 结束 ************************************ */
export function isMobileFunc() {
  let platform = false;
  const u = window.navigator.userAgent;
  const regexMatch = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
  const result = regexMatch.exec(u);
  if (u == null) {
    platform = true;
  }

  if (result == null) {
    platform = false;
  } else {
    platform = true;
  }
  return platform;
}
/* ********************************* 获取url参数值 开始 ************************************ */
export function getUrlParameter(parameterName, str) {
  const reg = new RegExp(`(^|&|\\?)${parameterName}=([^&]*)(&|$)`, 'i');
  let arr;
  let arr1;
  if (str) {
    arr = str.match(reg);
    arr1 = str.match(reg);
  } else {
    arr = window.location.search.substr(1).match(reg);
    arr1 = window.location.hash.substr(2).match(reg);
  }

  if (arr) {
    return arr[2];
  } else if (arr1) {
    return arr1[2];
  }

  return null;
}
/* ********************************* 获取url参数值 结束 ************************************ */

export function getToday() {
  const date = new Date();
  const y = date.getFullYear(); // 获取完整的年份(4位,1970-????)
  const m = date.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
  const d = date.getDate(); // 获取当前日(1-31)
  return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}`;
}

