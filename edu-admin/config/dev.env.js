'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"'
  BASE_API: '"http://127.0.0.1:8210"', // 后端接口API
  OSS_PATH: '"https://edu-lyb-file.oss-cn-beijing.aliyuncs.com"' // 阿里云OSS地址
})
