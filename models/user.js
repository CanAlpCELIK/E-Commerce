const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true,
     },
    email: {
       type: String,
       required: true,
      },
    password: {
        type: String,
        required: true,
    },
  }, {
    timestamps: true
    })

    


    // before saving, hashing the password with genSalt
    userSchema.pre('save', function(next){
      const user = this

      if(!user.isModified('password')) return next()

      bcrypt.genSalt(10,(err,salt) => {
            if(err) return next(err)

            bcrypt.hash(user.password,salt,(err,hash) => {
                if(err) return next(err)

                user.password = hash
                next()
          })
        })
     })



    const User = mongoose.model("User", userSchema)
    module.exports = User