const path = require('path');

const getPath = pathStr => path.resolve(__dirname, pathStr);

module.exports = {
  proxyPath: 'http://10.211.55.3', // 代理路径
  srcPath: getPath('../src'),
  distPath: getPath('../bebeforest-web'),
  templatePath: getPath('../public/index.html'),
};
