/*
 * @Author: RidingWind
 * @Date: 2018-11-02 16:52:10
 * @Last Modified by: 绩牛金融 - RidingWind
 * @Last Modified time: 2019-07-09 19:54:07
 */

/* eslint-disable max-len */

import axios from 'axios';
import Qs from 'qs';
import cookies from 'js-cookie';
import TOAST from './toast';
import Config from '../config';

const timeout = 3000;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    // const obj = {
    //   path: '/',
    //   domain: Config.domain,
    // };
    if (response.data.code === 2001) {
      window.location.replace(Config.loginUrl);
      // if (!(response.config.params.isAllow)) {
      //   // 添加isAllow=true,允许未登录不跳回登录界面
      //   cookies.set('callBackHref', window.location.href, obj);
      //   setTimeout(() => {
      //   }, 20);
      // }
    }
    // else if ((response.data.code !== 2001) && response.headers && response.headers['x-auth-token']) {
    //   cookies.set('x-auth-token', response.headers['x-auth-token'], obj);
    // }

    if (!response.data) {
      TOAST.show('服务器开小差，请稍后在试！');
    } else if (!response.data.success && response.data.code === 2001) {
      if (!(response.config && response.config.params && response.config.params.isAllow)) {
        TOAST.show('登陆过期，请重新登陆');
      }
    } else if (!response.data.success) {
      TOAST.show(response.data.message);
    }
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
/* eslint-disable no-restricted-syntax,guard-for-in,consistent-return */
export default function request(options, formType = 'FORM') {
  // formType，post请求的数据类型，默认FORM格式，可选项JSON、FORM
  const { url, method, data } = options;
  const { token } = sessionStorage;
  const Authorization = token || cookies.get('x-auth-token') || '';

  if (!window.isAction) {
    // 链接
    if ((method === 'GET') || (method === 'DELETE') || (method === 'PATCH')) {
      let ContentType = 'application/x-www-form-urlencoded';
      let object = data ? {
        params: data,
      } : {
        params: {},
      };
      if (formType === 'JSON' && data) {
        ContentType = 'application/json';
        object = {
          data,
        };
      }
      const headers = {
        'Content-Type': ContentType,
      };

      headers['X-Auth-Token'] = Authorization;
      // console.log('headers: ', headers);
      return axios({
        timeout,
        headers,
        url,
        method,
        ...object,
        paramsSerializer(params) {
          return Qs.stringify(params, {
            allowDots: true,
          });
        },
      })
        .then(checkStatus)
        .catch((error) => {
          if (error) {
            // TOAST.show('网络故障');
            // TODO, show error
          }
        });
    } else if ((method === 'POST') || (method === 'PUT')) {
      let DATA;
      let ContentType = 'application/x-www-form-urlencoded';
      if (formType === 'JSON') {
        ContentType = 'application/json';
        DATA = data;
      } else if (formType === 'UPLOAD') {
        // 添加上传图片的contentType
        ContentType = 'multipart/form-data';
        DATA = data;
      } else {
        const params = new URLSearchParams();
        for (const x in data) {
          params.append(x, data[x]);
        }
        DATA = params;
      }
      const headers = {
        'Content-Type': ContentType,
      };
      if (DATA) {
        headers['X-Auth-Token'] = Authorization;
      }
      return axios({
        timeout,
        headers,
        url,
        method,
        data: DATA,
      })
        .then(checkStatus)
        .catch((error) => {
          if (error) {
            // TOAST.show('网络故障.'); // TODO, show error
          }
        });
    }
  } else {
    // 功能号
    const contentTypeObj = options['Content-Type'] ? { 'Content-Type': options['Content-Type'] } : {};
    const tokenObj = Authorization ? { 'X-Auth-Token': Authorization } : {};
    const bodyObj = method === 'GET' ? {} : { body: data };
    let searchUrl;
    if (data) {
      searchUrl = '?';
      for (const prop in data) {
        searchUrl += `${prop}=${data[prop]}&`;
      }
      searchUrl = searchUrl.slice(0, -1);
    }

    const obj = Object.assign({
      action: 49404,
      method,
      url: method === 'GET' ? `${url}${searchUrl}` : url,
      // 请求标识
      // Reqno: new Date().getTime(),
      // 请求服务器标识
      // Reqlinktype: 1,
    }, contentTypeObj, tokenObj, bodyObj);

    const params = new URLSearchParams();

    for (const x in obj) {
      params.append(x, obj[x]);
    }

    const actions = {
      url: '/reqxml',
      method: 'POST',
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        tztWebdataEncrypt: 1,
      },
      timeout: 3000,
    };

    return axios(actions)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const responseObj = {
            data: JSON.parse(response.data.DATA),
          };
          return responseObj;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      });
  }
}
