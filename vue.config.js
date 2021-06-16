import CompressionPlugin from 'compression-webpack-plugin'
let prodEnv = false
if (process.env.NODE_ENV === 'production') {
  prodEnv = true
}

const mockServer = () => {
  if (process.env.NODE_ENV === 'development') {
    //return require('./mock/mockServer.ts')
  } else {
    return ''
  }
}

import { join } from 'path'

function resolve (dir) {
  join(__dirname, dir)
}
export const publicPath = process.env.rootPath
export const outputDir = process.env.outputDir
export const assetsDir = 'assets'
export const indexPath = 'index.html'
export const filenameHashing = true
export const pages = {
  index: {
    // page 的入口
    entry: 'src/main.ts',
    // 模板来源
    template: 'public/index.html',
    // 在 dist/index.html 的输出
    filename: 'index.html',
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: 'Index Page',
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  }
}
export const lintOnSave = false
export const runtimeCompiler = false
export const transpileDependencies = []
export const productionSourceMap = false
export const integrity = false
export const configureWebpack = {
  plugins: [
    new CompressionPlugin({
      // [file]被替换为原始资产文件名。
      // [path]替换为原始资产的路径。
      // [dir]替换为原始资产的目录。
      // [name]被替换为原始资产的文件名。
      // [ext]替换为原始资产的扩展名。
      // [query]被查询替换。
      // filename: '[path].br[query]',
      // filename: '[path].gz[query]',
      // 压缩算法
      algorithm: 'gzip',
      // algorithm: 'brotliCompress',
      // 匹配文件
      test: /\.(js|css|html|svg)$/,
      // compressionOptions: { level: 11 },
      // 压缩超过此大小的文件,以字节为单位
      threshold: 10240,
      minRatio: 0.8,
      // 删除原始文件只保留压缩后的文件 nginx中gzip_static与try_files 共存需要
      deleteOriginalAssets: false
    })
  ]
}
export function chainWebpack(config) {
  // config.plugin('vue-cli-plugin-compression').use(require('vue-cli-plugin-compression')).tap(args => {
  //   args.test = /\.(js|css)$/
  //   args.threshold = 10240
  //   return args
  // })
  // if (process.env.NODE_ENV === 'production') {
  //     config.plugin('webpack-bundle-analyzer')
  //         .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  //     config.optimization
  //         .splitChunks({
  //             chunks: 'all',
  //             cacheGroups: {
  //                 vendor: {
  //                     name: 'vendor',
  //                     priority: 1,
  //                     test: /node_modules/,
  //                     minSize: 30000,
  //                     minChunks: 1
  //                 },
  //                 commons: {
  //                     name: 'commons',
  //                     priority: 0,
  //                     minSize: 5000,
  //                     minChunks: 2
  //                 }
  //             }
  //         })
  //     // 启用GZip
  //     config.plugin('compression-webpack-plugin')
  //         .use(require('compression-webpack-plugin'))
  //         .init(Plugin => new Plugin({
  //             test: /\.(js|css)$/,
  //             threshold: 10240
  //         }))
  // }
}
export const css = {
  // type :boolean  defalut :"false"
  // 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。设置为 true 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
  // 细节查看https://cli.vuejs.org/zh/guide/css.html#css-modules
  requireModuleExtension: true,

  // type:boolean | object defalut:生产环境下是 true，开发环境下是 false
  // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
  // 当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
  // 提取 CSS 在开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容。然而，你仍然可以将这个值显性地设置为 true 在所有情况下都强制提取。
  // extract
  // type:boolean defalut :"false"
  // 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能。
  sourceMap: false
  // type:object defalut:{}
  // 向 CSS 相关的 loader 传递选项。css预设器配置项
  // loader 可以通过 loaderOptions 配置，包括：css-loader postcss-loader sass-loader less-loader stylus-loader
  // 具体细节查看 https://cli.vuejs.org/zh/guide/css.html#向预处理器Loader传递选项
  // loaderOptions: {
  //     sass: {
  //         prependData: `@import "~@/assets/css/_variables.scss";` // 引入全局变量
  //     },
  //     css: {
  //         // 这里的选项会传递给 css-loader
  //     },
  //     postcss: {
  //         // 这里的选项会传递给 postcss-loader
  //     }
  // }
}
//export const parallel = require('os').cpus().length > 1
export const pwa = {}
export const pluginOptions = {}
export const devServer = {
  hot: true,
  open: true,
  port: '8081',
  // proxy: {
  //   '/api_wp': {
  //     target: 'http://192.168.19.226:9020/',
  //     pathRewrite: {
  //       '^/api_wp': ''
  //     }
  //   },
  //   '/api_ess_wp': {
  //     target: 'http://192.168.19.9:9030/',
  //     pathRewrite: {
  //       '^/api_ess_wp': ''
  //     }
  //   }
  // },
  after: mockServer()
}
