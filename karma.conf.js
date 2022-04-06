process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine', 'karma-typescript'],
    basePath: './',
    files: [
      'jasmine/*.ts',
      {
        pattern: 'src/**/*.ts',
        type: 'js', // Silences the warning "Unable to determine file type from the file extension, defaulting to js".
      },
    ],
    exclude: [],
    preprocessors: {
      'jasmine/**/*.ts': 'karma-typescript',
      'src/**/*.ts': 'karma-typescript',
    },
    reporters: ['spec', 'karma-typescript'],
    karmaTypescriptConfig: {
      coverageOptions: {
        exclude: /jasmine/,
      },
      reports: {
        text: null, // Prints a coverage table in the console.
        html: {
          directory: 'coverage',
          subdirectory: 'html',
        },
      },
    },
  });
};
