let express = require("express")

let router = express.Router()

let controller = require("./controllers")

let Middleware = require("./auth")





router.post("/photo", Middleware.checkJWT, controller.postPhoto)

router.post("/register", controller.registerUser)

router.post("/login", controller.loginUser)

router.get("/timezones", Middleware.checkJWT, controller.listTimezones)

router.get("/users", Middleware.checkJWT, controller.listUsers)

router.get("/photo/:id", Middleware.checkJWT, controller.getUserPhoto)

router.get("/photo/timezone/:id", Middleware.checkJWT, controller.getTimezonePhoto)

router.delete("/photo/:id", Middleware.checkJWT, controller.deleteUserPhoto)




module.exports = router