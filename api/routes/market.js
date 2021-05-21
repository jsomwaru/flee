const express = require('express')
const validateRequest = require('../middlewares/validate-request')
const validater = require('express-validator')
const db = require('../services/db')

function initMarketRouter(marketService) {
    // This endpoint will be for users to send the metadat of the token they want to mint
    // I want them to send me the data and then I mint the tokens with the service account
    // This to prevent the situation where either the blockchain or the DB fails i can revert and 
    // let the user know
    router = express.Router()

    router.post('/market/mint',
    [validater.body("quantity").isInt(),
    validater.body("name").exists().isString(), 
    validater.body("ximg").exists().withMessage("please upload image")], 
    validateRequest, 
    async (req, res, next) => {
        
        const metadata = [{
                key: "name", 
                value: req.body.name
        }]
        var tx;
        try {
            tx = await marketService.mint(req.body.quantity, metadata)
        } catch(e) {
            console.log(e)
            return  res.status(400).json({"message": 'cancelling transaction'})
        }
                    
        // let r = await db.query('INSERT INTO flee_items VALUES($1,$2,$3)', req.body.name, req.body.owner, )
        //                 .catch(e => {
        //                     res.status(400).json({"status": "error minting"})    
        //                     next()
        //                 })
        console.log(tx)
        // console.log(r)
        return res.status(200).json({
           nfts: [] 
        })
    })
    return router
}

exports.initMarketRouter = initMarketRouter