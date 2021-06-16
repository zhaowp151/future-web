/**
 * @description 3个子配置，通用配置|主题配置|网络配置，建议在当前目录下修改config.js修改配置，会覆盖默认配置，也可以直接修改默认配置
 */
// 导出配置（以自定义配置为主）
import indexs from './default/index'
import configs from './config'
const config: any = Object.assign({}, indexs.settings, indexs.themes, indexs.networks, configs)
export default config
