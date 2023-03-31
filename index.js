const express = require('express')
const app = express()
const User = require('./models/user')
const Publication = require('./models/publication')
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')

// const router = express.Router()

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
app.use(session({ secret: 'secretCode' }))

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/login')
    }
    else {
        next()
    }
}

app.get('/', (req, res) => {
    res.redirect('/user')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/user/publication', requireLogin, (req, res) => {
    res.render('user/publication')
})

app.get('/user', requireLogin, async (req, res) => {
    const getUserId = req.session.user_id;
    const publications = await Publication.find({ userId: getUserId })
    res.render('user/index', { publications })
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username: username, password: password, role: 'basic' })
    await user.save()
    req.session.user_id = user._id;
    res.redirect('/user')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
        res.send('<h1>No such user</h1>')
    }
    else {
        const validPassword = await bcrypt.compare(password, user.password)
        if (validPassword) {
            req.session.user_id = user._id;
            res.redirect('/user')
        }
        else {
            res.send('<h1>Incorrect password</h1>')
        }
    }
})

app.post('/user/publication', requireLogin, async (req, res) => {
    const { pubTitle, journalName, publisher, issn, vol, issue, pageno, date } = req.body;
    const getUserId = req.session.user_id;
    const publication = new Publication({
        userId: getUserId,
        slno: 1,
        title: pubTitle,
        journal: {
            name: journalName,
            publisher: publisher,
            issn: issn,
            vol: vol,
            issue: issue,
            pageno: pageno,
        },
        doi: '12312aa',
        date: date,
    })
    await publication.save()
    res.redirect('/user')
})

app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

app.post('/user/publication/delete/:id', async (req, res) => {
    const { id } = req.params;
    const deletedPub = await Publication.findByIdAndDelete(id)
    res.redirect('/user')
})
app.listen(3000, () => {
    console.log('Listening on port 3000')
})