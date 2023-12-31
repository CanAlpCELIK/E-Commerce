const User = require('../models/user')
const Item = require ('../models/item')
const Cart = require ('../models/cart')
const {generateToken} = require('../helper/jwtUtils')
const bcrypt = require('bcrypt')


//REGİSTER 
    const createUser = async(userData) => {
    try {

            if(userData.password.length <6 ){
                return {
                    status:400,
                    error: 'Password length should be more than 6 '
                }
            }
            
            const user = new User(userData)
            await user.save();

            const useri = await User.findOne({name: user.name})

            if (!useri) {
                return {
                    status : 500,
                    error : ' user not found after save'
                }
            }
        
            return {
                status:200,
                data:{
                    user : useri,   
                    message :'User created succesfuly'
                },    
            }
            
        } catch (err) {
            return {
                status:500,
                error : 'Something went wrong',
                errorMessage : err.message
            }
            
        }
    }
//LOGİN CONTROLLLER
    const login = async(userData) =>{
        try {
            const user = await User.findOne({name: userData.name})

            if(!user){
                return {
                    status: 401,
                    error :'Invalid credentials'
                }
            }   
            const passwordMatch = await bcrypt.compare(userData.password, user.password)

            if (!passwordMatch) {
                return{
                    status:401,
                    error : 'Password couldnt match'
                }
            }

            const token = generateToken(user)

            return{
                status:200,
                data : {
                    user,
                    token
                }
            }
            
        } catch (error) {
            return{
                status:500,
                error : error.massage
            }
        }
    }

        const updateProfile = async(userId,body) => {
        try {
            const checkuser = await User.findOne({_id:userId})
            if (!checkuser) {
                return { message : 'user not found'}
            }

            
            const checkUsername = await User.findOne({name: body.name, _id : {$ne:userId}})

            if (checkUsername) {
                return { status: false , message : 'This name has already taken'}
            }


            const checkEmail = await User.findOne({email: body.email, _id:{$ne:userId}})

            if (checkEmail) {
                return {status:false, message: 'This email has already taken'}
            }

            checkuser.name = body.name,
            checkuser.email= body.email

            await checkuser.save()

            return {status:true , message:'profile updated'}

        } catch (error) {
            return {
                status:500,
                error: error.message
            }
        }
    }
   
    const updatePassword = async(userId, body) => {
        try {
            
            const userg = await User.findOne({_id: userId})

                if (!userg) {
                    return{
                        status : false,
                        message: 'User couldnt found'
                    }
                }

            if (!body.currentPassword || ! body.newPassword || !body.newPasswordConfirmation ) {
                return{
                    status : false,
                    message: 'Fill all the blanks'
                }
            }

            const passwordMatch = await bcrypt.compare(body.currentPassword,userg.password)
                
                if (!passwordMatch) {
                    return {
                        status: 401,
                        error : message.error 
                    }
                }

            if (!body.newPassword == body.newPasswordConfirmation) {
                return{
                    status : false,
                    message: 'Password not match'
                }
            }
           
            
            userg.password = await bcrypt.hash(body.newPassword, 10)

            await userg.save();

            return { status : true , message: 'Password updated succesfuly'}
        } catch (error) {
            return {status:false , message : error.message}
        }
    }


//// create Item

    const createItem = async(req, body) => {
        try {    

            const { name, description, category, price } = body;

            if ( !req.user.userId ||!name || !description || !category || !price) {
                return {
                    status: 400,
                    error: "Fill all the blanks"
                };
            }

            const itemData = {
                owner: req.user.userId,
                name: body.name,
                description: body.description,
                category: body.category,
                price: body.price
            }
            const item = new Item(itemData)
            const newItem = await item.save()

            return {
                status : 200,
                data  : newItem
            }
        } catch (error) {
            return {
                status: 400,
                error : message.error
            }
        }
    }


    const updateItem = async (itemId,body) => {
        try {

            const itemg = await Item.findOne({_id:itemId})  

            if (!itemg) {
                return {status:false,  message: 'Item couldnt found'}
            }
            itemg.name = body.name,
            itemg.description = body.description,
            itemg.category = body.category,
            itemg.price = body.price   
            
            await itemg.save()

            return {
                status: 200, 
                data : itemg
            }
            
        } catch (error) {
            return {
                status: 500,
                error: error.message
            }   
        }
    }


    const deleteItem = async (itemId) =>{
        try {
            const deleteItem = await Item.findByIdAndDelete(itemId)
            
            if (!deleteItem) {
                return{
                    status: false,
                    message: 'Item couldnt found'
                }
            }
            return {
                status:200,
                message: 'Item deleted'
            }
            
        } catch (error) {
            return{
                status:500,
                error: error.message
            }
        }
    }

    const addItemToCart = async(cartId, itemId, quantity) => {
        try {
            const item = await Item.findById(itemId);
    
            if (!item) {
               return {
                status : false,
                message : 'Item couldnt found'
               }
            }
    
           
            const cart = await Cart.findOne({_id : cartId});   
            if (!cart) {
                return{
                    status: false,
                    message: 'User dont have a cart yet please get a cart'
                }
            }
    
            const existingItem = cart.items.findIndex((cartItem) => cartItem.itemId.equals(itemId));
    
            if (existingItem !== -1) {
                cart.items[existingItem].quantity += quantity;
            } else {
                cart.items.push({
                    itemId ,
                    name: item.name,
                    quantity,
                    price: item.price
                });
            }
    
            cart.bill += item.price * quantity
    
            await cart.save()
            return cart
        } catch (error) {
            return{
                status: 500,
                error: message.error
            }
        }
    }
    
    const removeItemfromCart = async(cartId, itemId, quantity) => {
        try {
            const item = await Item.findOne({_id: itemId })
    
            if (!item) {
                return {
                    status : false,
                    message : 'Item couldnt found'
                   }
            }
    
            const cart = await Cart.findOne({_id :cartId });

            if (!cart) {
                return{
                    status: false,
                    message: 'User dont have cart please get one'
                }
            }
    
            const existingItem = cart.items.findIndex((cartItem) => cartItem.itemId.equals(itemId));
    
            if (existingItem !== -1) {
                if (cart.items[existingItem].quantity <= quantity) {
                    cart.bill -= cart.items[existingItem].price * cart.items[existingItem].quantity;
                    cart.items.splice(existingItem, 1);
                } else {
                    cart.bill -= cart.items[existingItem].price * quantity;
                    cart.items[existingItem].quantity -= quantity;
                }
    
                await cart.save();
                return cart;
            } else {
               return {
                status : false,
                message : 'Item couldnt found in your cart'
               }
            }
        } catch (error) {
            return {
                status: 500,
                error : message.error
            }
        }
    }


    const createCart = async (userId) => {
        try {
            const newCart = await new Cart({
                owner: userId,
                items: [],
                bill: 0
            });
            await newCart.save();
            return newCart;
        } catch (error) {
            return {
                status: 500,
                error: error.message
            };
        }
    };
    
    const getUserCart = async (userId) => {
        try {
            const cart = await Cart.findOne({ owner: userId });
            return cart;
        } catch (error) {
            return {
                status: 500,
                error: error.message
            };
        }
    };
    



module.exports ={
        createUser,
        login,
        updateProfile,
        updatePassword,
        createItem,
        updateItem,
        deleteItem,
        addItemToCart,
        removeItemfromCart,
        createCart, 
        getUserCart
}