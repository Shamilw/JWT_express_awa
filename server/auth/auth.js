const express      = require('express');
const router       = express.Router();
const database     = require('./../database/index');
const User         = database.model('User');
const Refreshtoken = database.model('Refreshtoken');
const uuid         = require('uuid/v4')
const bCrypt       = require('bcryptjs')
const jwt          = require('jsonwebtoken')
const config       = require('../config.js')

async function TokenPair(user) {
  const newRefreshToken = uuid();
  await Refreshtoken.create({
  refreshtoken: newRefreshToken,
    userid:user._id,
  })
  return {
    token: jwt.sign({ id: user._id,type:user.type }, config.SECRET,{ expiresIn: '30m' }),
    newrefreshtoken: newRefreshToken
  };
}

router.post('/login', async  ( req, res ) => {
    try {
    const {login,password} =req.body
    const user= await User.findOne({login})

    if (!user ||! bCrypt.compareSync(password,user.pass_h)) {
      const e = new Error();
      e.status = 403;
      throw e;
    }

   const {token,newrefreshtoken}= await TokenPair(user)

    res.status(200).send({status:'succses',token,refreshtoken:newrefreshtoken})
    }catch (e) {
     res.status(403).send({ status: 'error'})
    }
  });

router.post('/refresh', async  ( req, res ) => {
    try {
    const { refreshtoken } = req.body
    const dbToken = await Refreshtoken.findOne({ refreshtoken: refreshtoken })
    if (!dbToken) {
      const e = new Error();
      e.status = 403;
      throw e;
    }
    const user=await User.findById(dbToken.userid)
    await Refreshtoken.deleteOne({refreshtoken})
    const {token,newrefreshtoken}= await TokenPair(user)
    res.status(200).send({status:'succses',token,refreshtoken:newrefreshtoken})
    }catch (e) {
     res.status(403).send({ status: 'error'})
    }
  });

router.post('/logout', async  ( req, res )=> {
  try {
   const { refreshtoken } = req.body
   const sess= await Refreshtoken.findOne({refreshtoken})
   await Refreshtoken.deleteMany({userid:sess.userid})
   res.status(200).send({status:'succses'})
  } catch (e) {
    res.status(403).send({ status: 'error'})
  }
});

 module.exports = router