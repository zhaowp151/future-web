/**
 * @description 导出默认配置(通用配置|主题配置|网络配置)
 **/
const setting = require('./setting.config.ts')
const theme = require('./theme.config.ts')
const network = require('./net.config.ts')

module.exports = { setting, theme, network }
