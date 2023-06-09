const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

const userSchema = Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
    role: {
        type: String,
        enum: [ROLE.ADMIN, ROLE.BASIC]
    },
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

module.exports = mongoose.model('User', userSchema)