import request from '../utils/request';
import Config from '../config';
import { getToday } from '../utils/tool';

const {
  baseUri: { stockUri, goldStockUri },
} = Config;

/* eslint-disable import/prefer-default-export */
export function getGoldStock({ orderBy, signalFrom, signalTo }) {
  const obj = signalTo ? { signalTo } : {};
  return request({
    url: `${goldStockUri}/gold-stock`,
    method: 'GET',
    data: Object.assign({
      signalFrom,
      orderBy,
      pageNum: 1,
      pageSize: 3,
    }, obj),
  });
}

export function getLatest() {
  return request({
    url: `${stockUri}/calendar/latest`,
    method: 'GET',
    data: {
      end: getToday(),
      limit: 20,
    },
  });
}
