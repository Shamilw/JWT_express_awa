const packageJson = require('./package');
const { files: tests } = packageJson.ava;

module.exports = function () {
    return {
      files: [
        'app.js', // adjust if required 
        'server/*.js', 
        'server/**/*.js', 
        'server/auth/middleware/*.js', 
        'test/helpers/*.js'
      ],
  
      // tests: [
      //   'test/*.js' // adjust if required
      // ],
      tests,
      env: {
        type: 'node'
      },
      middleware: (app, express) => {
        app.use('/jspm_packages',
                express.static(
                   require('path').join(__dirname, 'jspm_packages')));
      },
      
    workers: {
      recycle: true
    },
      debug: true,
      testFramework: 'ava',
    };
  };