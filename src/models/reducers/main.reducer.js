import createReducer from './createReducer';

/* eslint-disable arrow-body-style */
const initState = {
  latest: [],
  goldStock: [],
  stock: [],
};

export const actionType = {
  setLatest: 'main/setLatest',
  setGoldStock: 'main/setGoldStock',
  setStock: 'main/setStock',
};

const reducer = {
  [actionType.setLatest]: (state, { payload }) => {
    return { ...state, latest: payload };
  },
  [actionType.setGoldStock]: (state, { payload }) => {
    return { ...state, goldStock: payload };
  },
  [actionType.setStock]: (state, { payload }) => {
    return { ...state, stock: payload };
  },
};

export default createReducer(initState, reducer);
