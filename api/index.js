const express = require("express")
const routes   = require('./routes/profile')
const marketRoutes = require('./routes/market')
const flowService = require('./services/flee-service')
const {MarketService} = require('./services/market-service')
require('dotenv').config({path: './services/.env'})
const app = express()
const port = 7778

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin',  '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-api-key');
    next();
});
let flow = new flowService.FlowService(process.env.SERVICE_ADDRESS, 0, process.env.PRIVK_KEY)
app.use(express.json())
app.use("/v1", routes.initProfileRouter())
app.use("/v1", marketRoutes.initMarketRouter(new MarketService(flow)))
app.listen(port,() => {
    console.log(`api listening at http://localhost:${port}`)
  })
