const express = require('express')
const router = express.Router()  

const userController = require ('../controllers/userController')
const authenticateToken = require ('../helper/authenticateToken')


// create itemmm

router.post('/item', authenticateToken, async(req,res) => {
    try {
        const newItem = await userController.createItem(req , req.body)

        res.send(newItem)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



//update Item 

router.put ( '/item/:itemId', authenticateToken , async (req,res) =>{
    try {
        const updateItem = await userController.updateItem(req.params.itemId , req.body)

        res.send(updateItem)
    } catch (error) {
        res.status(500).json({ message : error.message})
    }
})



//delete Item

router.delete ('/item/:itemId', authenticateToken , async (req,res) => {
    try {
        const deleteItem = await userController.deleteItem(req.params.itemId)
        res.send(deleteItem)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = router;
