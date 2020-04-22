const express   = require('express');
const router    = express.Router();
const database  = require('../server/database/index');
const User      = database.model('User');
const middlAuth    = require('./auth/middleware/middlewareauth.js')

router.post('/testpost', async  (  req, res ) => {
    try {
     res.send({status:'succses',data:req.body})
    }catch (e) {
     res.send({ status: 'error'})
    }
  });
router.post('/testpostauth', middlAuth, async  (  req, res ) => {
    try {
     res.send({status:'succses',data:'secret'})
    }catch (e) {
     res.send({ status: 'error'})
    }
  });

 
module.exports = router