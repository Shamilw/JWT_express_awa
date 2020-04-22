const jwt = require('jsonwebtoken');
const config =require('../../config')

module.exports= async (req,res,next)=>{
    try {
        const authHeader = req.get('Authorization')
        if(!authHeader){
            const e = new Error();
            e.status = 401;
            throw e;
        }else{
        const token = authHeader.split(' ')[1]
        try{
            jwt.verify(token,config.SECRET)
            next();
        }catch(err){
            if (err instanceof jwt.JsonWebTokenError){
                const e = new Error();
                e.status = 401;
                throw e;
            }
        }}
    } catch (error) {
        res.status(401).send({status:'error'});
    }

    
}
