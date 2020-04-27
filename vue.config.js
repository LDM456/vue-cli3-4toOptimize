const path = require('path')
// 是否为生产环境（配置cdn可选择自己服务器上的文件）
const isProduction = process.env.NODE_ENV !== 'development'
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 本地环境是否需要使用cdn
const devNeedCdn = false

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter'
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    'http://114.242.26.227:118/test/js/vue.min.js',
    'http://114.242.26.227:118/test/js/vuex.min.js',
    'http://114.242.26.227:118/test/js/vue-router.min.js'
  ]
}

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, '../', dir)
  }
module.exports = {
  publicPath: './', // 编译后的地址，可以根据环境进行设置
  lintOnSave: true, // 是否开启编译时是否不符合eslint提示
  productionSourceMap: false,
  devServer: {
    port: 8080,
    disableHostCheck: true,
    proxy: {
      '/api': {
        // 目标 API 地址
        target: '192.168.0.18:7692',
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: { // 路径重写，
          '^/api': '' // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            unitToConvert: "px",
            viewportWidth: 750,
            unitPrecision: 3,
            propList: [
              "*"
            ],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: /(\/|\\)(node_modules)(\/|\\)/,
          })
        ]
      }
    }
  },
  chainWebpack: config => {

    // ============压缩图片 start(废弃)============
    // config.module
    //   .rule('png')
    //   .use('image-webpack-loader')
    //   .loader('image-webpack-loader')
    //   .options({ bypassOnDebug: true })
    //   .end()
    // ============压缩图片 end============
    // 代码分割压缩
    config.optimization.minimize(true)
    config.optimization.splitChunks({
      chunks: 'all'
    })
    // 配置别名
    // config.resolve.alias
    //   .set('@', resolve('src'))
    //   .set('assets', resolve('src/assets'))
    //   .set('components', resolve('src/components'))
    //   .set('router', resolve('src/router'))
    //   .set('utils', resolve('src/utils'))
    //   .set('static', resolve('src/static'))
    //   .set('store', resolve('src/store'))
    //   .set('views', resolve('src/views'))
    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
    // ============注入cdn start============
    configureWebpack: config => {
      // 用cdn方式引入，则构建时要忽略相关资源
      if (isProduction || devNeedCdn) config.externals = cdn.externals
      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
    }
  }
}