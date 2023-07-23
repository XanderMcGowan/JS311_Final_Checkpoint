let jwt = require("jsonwebtoken")

let checkJWT = function(req, res, next){

   let value = req.get("Authorization")

   if(value){
    let parts = value.split(" ")
    if(parts[0] == 'Bearer' && parts [1]){
        signedToken = parts[1]
    }
   }
   try{
    let token = jwt.verify(signedToken, process.env.JWT_SECRET)

    req.__userinfo = token

    next()
   } catch(err){
    console.log("failed", err)
    res.sendStatus(401)
   }
   

}

module.exports = {
    checkJWT
}