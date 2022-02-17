const express = require('express')
const router = express.Router();
const User = require('../models/user')

router.get('/register' , (req , res) => {
    res.render('users/register')
})

router.post('/register' , async(req , res) => {
   // const user = new User(req.body)
    //await user.save();
    res.send(req.body)
})

module.exports = router;