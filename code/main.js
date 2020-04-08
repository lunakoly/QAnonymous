const express = require('express')


const app = express()
app.use('/public', express.static('public'))


const mustageExpress = require('mustache-express')
app.engine('html', mustageExpress())
app.set('view engine', 'html')


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


const expressSession = require('express-session')
app.use(expressSession({
    'secret': 'supercat',
    'resave': false,
    'saveUninitialized': false
}))


const authentication = require('./authentication')
authentication.configure(app)


const rootRouter = require('./routers/root')
app.use('/', rootRouter)


const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
