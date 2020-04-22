const express = require('express')
const cors = require('cors')
const bodyparser= require('body-parser')

function createApp() {
  const app = express()
  const http = require('http').Server(app)
  
  app.use(cors());
    app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", '*')
      res.header("Access-Control-Allow-Credentials", "true")
      res.header("Access-Control-Allow-Headers", "X-Requested-With")
      res.header("Access-Control-Allow-Headers", "Content-Type")
      res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
      next()
    })
  
    app.use(bodyparser.urlencoded());
    app.use(bodyparser.json());

  app.use('/',require('./server/routes'))
  app.use('/auth', require('./server/auth/auth'))
  app.get('/t', (req,res) => {
    res.status(909).send('ok')
  });
  http.listen(0, function () {
    console.log('Server listening on port 9001!')
  })

  return app;
}

createApp()
module.exports = createApp;