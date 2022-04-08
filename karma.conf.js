process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine', 'karma-typescript', 'viewport'],
    basePath: './',
    files: [
      'jasmine/*.ts',
      'src/**/*.css',
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
      compilerOptions: {
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        module: 'commonjs',
        sourceMap: true,
        target: 'ES5',
        typeRoots: ['node_modules/@types', 'node_modules/karma-viewport'],
      },
      exclude: ['node_modules'],
      coverageOptions: {
        exclude: [
          /\.(d|spec)\.ts$/i,
          /utils\/test-utils\.ts$/,
          /jasmine/
        ],
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
