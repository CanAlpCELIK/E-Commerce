
const {verifyToken} = require('./jwtUtils')

function authenticateToken (req,res,next) {

    const Token = req.headers['authorization']
    if(!Token){
        return res.status(401).json({message :'Unauthenticate Token'})
    }

    const TokenC = req.headers['authorization'].replace('Bearer ', '')
    
    const user = verifyToken(TokenC)

    if(!user){
        return res.status(403).json({message:'Invalid Token'})
    }

    req.user = user
    next()
}


module.exports = authenticateToken;
