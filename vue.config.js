const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')
const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')
const path = require('path')

function mock (app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288,
      maxEntrypointSize: 524288
    },
    plugins: [
      new SkeletonPlugin({
        pathname: path.resolve(__dirname, './shell'),
        staticDir: path.resolve(__dirname, './dist'),
        routes: ['/'],
        grayBlock: ['.title-text', '.search-bar-input', '.home-title-wrapper > .btn'],
        hide: ['.icon-search', '.input']
      })
    ]
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV !== 'development') {
      config.plugin('html').tap(opts => {
        opts[0].minify.removeComments = false
        return opts
      })
    }
  }
}
