const express = require("express")
const routes   = require('./routes/profile')
const cors = require("./middlewares/cors")
require('dotenv').config({path: './services/.env'})
const app = express()
const port = 7778

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin',  '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-api-key');
    next();
});
app.use(express.json())
app.use( "/v1", routes.initProfileRouter())

app.listen(port,() => {
    console.log(`api listening at http://localhost:${port}`)
  })
