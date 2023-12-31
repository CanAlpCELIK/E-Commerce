const express = require('express')
const router = express.Router()
const userController = require ('../controllers/userController')
const authenticateToken = require('../helper/authenticateToken')


//create cart
router.post('/cart/create', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const createdCart = await userController.createCart(userId);
        res.send(createdCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add item to the cart
router.post('/cart', authenticateToken, async(req,res) => {
    try {
        const cartId = req.body.cartId;
        const itemId = req.body.itemId;

        if (!cartId || !itemId) {
            return {
                status : false,
                message : ' cartId ve itemId must be written'
            };
        }
        const addItem = await userController.addItemToCart(cartId, itemId, req.body.quantity)
        res.send(addItem)
    } catch (error) {
        res.send(error)
    }   
})


//Remove the item from cart
router.delete('/cart', authenticateToken, async(req,res) => {
    try {
        const cartId = req.body.cartId;
        const itemId = req.body.itemId;

        if (!cartId || !itemId) {
            return {
                status : false,
                message : ' cartId ve itemId must be written'
            };
        }
        const removeItem = await userController.removeItemfromCart(cartId, itemId, req.body.quantity)
        res.send(removeItem)
    } catch (error) {
        res.send(error)
    }
})

// get the cart
router.get('/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const userCart = await userController.getUserCart(userId);
        res.send(userCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






module.exports = router ;

