const jwt = require('jsonwebtoken')

function generateToken(user){
  const payload = {
    userId : user._id,
    username: user.name,
    email : user.email
  }

  const options = {
    expiresIn: '30d'
  }

  return jwt.sign(payload, 'ecommercewebapi', options)
}


function verifyToken(Token){
    try{
        const decoded = jwt.verify(Token, 'ecommercewebapi' ) 
        return decoded
    } catch(err){
        return null
    }
}

module.exports ={
    generateToken,
    verifyToken
}