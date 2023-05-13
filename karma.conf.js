module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jsdom-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    // preprocessors: {
    //   './src/test.ts': ['@angular-devkit/build-angular'],
    // },
    client: {
      clearContext: false,
      random: false,
      oneFailurePerSpec: true,
      failFast: true,
      timeoutInterval: 1000,
    },
    coverageReporter: {
      dir: './coverage',
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    angularCli: {
      environment: 'dev',
    },
    jasmineHtmlReporter: {
      suppressAll: true,
      suppressFailed: false,
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['jsdom'],
    singleRun: true,
    restartOnFileChange: true,
  })
}
