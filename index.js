const express = require('express')
const app = express()
const User = require('./models/user')
const path = require('path')
const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/paperpublication')
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR")
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/student', (req, res) => {
    res.render('student/index')
})

app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({ username: username, password: password, role: 'student' })
    await user.save()
    res.redirect('/student')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})