let express = require("express")
require("dotenv").config
let app = express()
let PORT = process.env.PORT || 8080

app.use(express.json( { extended: false } ))
app.use(express.static("./public"))

let routes = require("./routes")
app.use(routes)


app.listen(PORT, function(){
    console.log("Application is listenting on port", PORT)
})