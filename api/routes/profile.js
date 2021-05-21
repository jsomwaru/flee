const express = require('express')
const validater = require('express-validator')
const validateRequest = require('../middlewares/validate-request')
const db = require('../services/db')


function initProfileRouter() {
  
    router = express.Router()
    router.post('/profile/provision-user',
        [validater.header('X-Api-Key').exists().equals(process.env.API_KEY),
         validater.body("username").exists().isString().withMessage("username not found"),
         validater.body("address").exists().isString().withMessage("address not found")],
        validateRequest,
        async (req, res, next) => {
            // add user to db and return information
            var r;         
            try { 
                 r = await db.query('insert into users values($1, $2) RETURNING *', [req.body.address, req.body.username])
            } catch (e) {
                console.log(e)
                res.status(400).send("There was an error Initializing your account")
                next()
            }
            res.status(200).json({
                "message": "success",
                "user": r.rows[0]
            })
        })

    router.get('/profile/:username', async (req, res, next) => {
        try { 
            var r = await db.query('select * from users where address = $1', [req.params.username])
        } catch(e) {
            console.log(e)
            res.status(500)
            next()
        }
            console.log(r.rows)
            if(!r.rows.length) {
               next()
            }
            res.status(200).json(r.rows)
        })
        
        router.post ('/', async (req, res, next) => {
            console.log(req.body)
        })
        return router
}


exports.initProfileRouter = initProfileRouter;