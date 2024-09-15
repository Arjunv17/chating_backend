const JWT = require('jsonwebtoken');


const createToken = async (data, expireTime) => {
  return await JWT.sign({ id: data._id, role: data.role }, process.env.JWTSECRET, { expiresIn: expireTime })
}

const verifyToken = async (data)=>{
    return await JWT.verify(data, process.env.JWTSECRET)
}

module.exports = {
    createToken, verifyToken
}