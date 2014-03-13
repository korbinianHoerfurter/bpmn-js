module.exports = function(karma) {
  karma.set({

    basePath: '../../',

    frameworks: [ 'jasmine', 'browserify' ],

    files: [
      'test/spec/browser/**/*Spec.js'
    ],
    
    reporters: [ 'dots' ],

    preprocessors: {
      'test/spec/browser/**/*Spec.js': [ 'browserify' ]
    },

    browsers: [ 'Chrome' ],

    singleRun: false,
    autoWatch: true,

    // browserify configuration
    browserify: {
      debug: true,
      watch: true,
      transform: [ 'debowerify', 'brfs' ]
    }
  });
};