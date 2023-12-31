const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const authenticateToken = require ('../helper/authenticateToken')

//updateProfil 

    router.put('/profil', authenticateToken, async(req,res) => {
        try {
            const useri = req.user.userId
            const updateProfil = await userController.updateProfile(useri, req.body)
            res.send(updateProfil)
        } catch (error) {
            res.send(500).json({message: error.message})
        }
    } )

// updatepassword 


    router.post ('/updatepassword', authenticateToken, async(req,res) => {

        try {
            const newPassword = await userController.updatePassword(req.user.userId, req.body)

            res.send(newPassword)
        } catch (error) {
            res.send(500).json({message: error.message})
        }
    })
    module.exports = router;