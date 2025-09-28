const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = (config, options) => {
  // Enable top-level await
  config.experiments = {
    ...config.experiments,
    topLevelAwait: true,
  }

  // Enable production-level optimizations
  if (options.production) {
    // Split vendor chunks for better caching
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Angular framework
          angular: {
            name: 'angular',
            test: /[\\/]node_modules[\\/]@angular[\\/]/,
            priority: 60,
            chunks: 'all',
            enforce: true
          },
          // Bootstrap and UI libraries
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](bootstrap|@ng-bootstrap|font-awesome|bootstrap-icons)[\\/]/,
            priority: 50,
            chunks: 'all',
            enforce: true
          },
          // Three.js and 3D libraries
          threejs: {
            name: 'threejs',
            test: /[\\/]node_modules[\\/](three|@types\/three)[\\/]/,
            priority: 45,
            chunks: 'all',
            enforce: true
          },
          // RxJS
          rxjs: {
            name: 'rxjs',
            test: /[\\/]node_modules[\\/]rxjs[\\/]/,
            priority: 40,
            chunks: 'all',
            enforce: true
          },
          // Other vendor libraries
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 30,
            chunks: 'all',
            enforce: true,
            minChunks: 2
          },
          // Common code between components
          common: {
            name: 'common',
            minChunks: 2,
            priority: 20,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }

    // Add bundle analyzer for optimization insights
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-report.html'
        })
      )
    }
  }

  return config
}
