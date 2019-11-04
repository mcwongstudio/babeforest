import { takeLatest, call, put } from 'redux-saga/effects';
import { actionType as mainReducer } from '../reducers/main.reducer';
import * as mainService from '../../services/main.service';

export const actionType = {
  getLatest: 'main/getLatest',
  getGoldStock0: 'main/getGoldStock0',
  getGoldStock20: 'main/getGoldStock20',
  clearStock: 'main/clearStock',
};

export function* getLatest({ payload: { successFunc } }) {
  const data = yield call(mainService.getLatest);
  if (data) {
    if (data.data.success) {
      successFunc(data.data.result);
      yield put({ type: mainReducer.setLatest, payload: data.data.result });
    }
  } else {
    alert('服务器开小差，请稍后在试！');
  }
}

export function* getGoldStock0({ payload }) {
  const data = yield call(mainService.getGoldStock, payload);

  if (data && data.data.success) {
    yield put({ type: mainReducer.setStock, payload: data.data.result.list || [] });
  }
}

export function* getGoldStock20({ payload }) {
  const data = yield call(mainService.getGoldStock, payload);

  if (data && data.data.success) {
    yield put({ type: mainReducer.setGoldStock, payload: data.data.result.list || [] });
  }
}

export function* clearStock() {
  yield put({ type: mainReducer.setStock, payload: [] });
}

export default function* root() {
  yield [
    takeLatest(actionType.getLatest, getLatest),
    takeLatest(actionType.getGoldStock0, getGoldStock0),
    takeLatest(actionType.getGoldStock20, getGoldStock20),
    takeLatest(actionType.clearStock, clearStock),
  ];
}
