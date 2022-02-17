const express = require('express')
const farmRouter = express.Router();

farmRouter.get('/farms' , function(req , res , next) {
    res.end()
}) 


