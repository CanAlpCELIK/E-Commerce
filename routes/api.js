const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

//REGISTER ROUTE


router.post('/register',async(req,res) => {
    try {
        const user = await userController.createUser(req.body)
        res.send(user)
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//LOGIN ROUTE

router.post('/login', async(req,res) => {
    try {
        const user = await userController.login(req.body)
        res.send(user)
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



module.exports =  router;