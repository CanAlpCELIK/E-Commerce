const express = require('express')
require('dotenv').config();

const apiRouter = require ('./routes/api')
const itemRouter = require ('./routes/item')
const cartRouter = require ('./routes/cart')
const profilRouter = require ('./routes/profil')
const db = require ('./helper/db')



const app = express()
app.use(express.json())


app.use(apiRouter)
app.use(itemRouter)
app.use(cartRouter)
app.use(profilRouter)

const Port = process.env.port


app.listen(Port, () => {
    console.log(` Server listenin on http://localhost:${Port}`)
})