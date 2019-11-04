let env = process.env.NODE_ENV;

if (env && env === 'test') { // 避免特殊情况
  env = 'development';
}
const {
  baseUrl, loginUrl, domain, isAction,
} = window;

const apiUrl = {
  development: isAction ? '' : (baseUrl || 'http://bebeforest.com:8080'),
  production: isAction ? '' : (baseUrl || 'http://app.bebeforest.com'),
};
const apiUri = apiUrl[env];
const baseUri = {
  stockUri: `${apiUri}/stock-service`,
  goldStockUri: `${apiUri}/gold-stock-service`,
};
const configs = {
  base: {
    baseUri,
    apiUri,
    stockDetailUrl: env === 'development' ? 'http://stock.test.jiniutech.cn/#/stockDetail/' : 'https://stock.jiniutech.com/#/stockDetail/SZ300711',
    fundLoginUrl: 'http://action:10090/?loginType=1&&longinKind=1',
    contractId: 'a141e5af-3987-4249-878c-3d0966dabd6e',
    productIdObj: {
      2001: '脱水研报',
      2002: '选股宝早知道',
      2003: '盘中突发',
    },
    specInfo: {
      SECONDS: '秒',
      MINUTES: '分钟',
      HOURS: '小时',
      DAY: '天',
      WEEK: '周',
      MONTH: '月',
      YEAR: '年',
    },
  },
  development: {
    // loginUrl: loginUrl || 'http://account.test.jiniutech.cn',
    loginUrl: loginUrl || '/#/login',
    domain: domain || '.test.jiniutech.cn',
  },
  production: {
    // loginUrl: loginUrl || 'http://account.jiniutech.com',
    loginUrl: loginUrl || '/#/login',
    domain: domain || '.jiniutech.com',
  },
};

export default {
  ...configs.base,
  ...configs[env],
};
