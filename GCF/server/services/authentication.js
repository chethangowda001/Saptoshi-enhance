const jwt = require("jsonwebtoken")

const secrect = "Saptoshi@123@"

function genarateTokenForUser(user){
    const payload = {
        fullName : user.fullName,
        _id : user.id,
        email: user.email,
    }
     const token = jwt.sign(payload, secrect);
     console.log(token);
     
     return token;
}

function validateToken(token){
    const payload = jwt.verify(token, secrect);
    return payload;
}

module.exports = {
    genarateTokenForUser,
    validateToken,
}