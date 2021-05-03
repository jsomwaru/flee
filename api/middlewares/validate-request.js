const express = require("express")
const validationRequest = require('express-validator').validationResult

const validateRequest = (req, res, next) => {
    const errors  = validationRequest(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()        
        })
    }
    next();
}

module.exports = validateRequest;