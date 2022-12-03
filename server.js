require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const multer = require('multer')


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))



const userRouter = require('./routes/users')
const authRoute = require('./routes/auth')
const ingredientRouter = require('./routes/ingredients')


app.use(express.json())
app.use(multer({dest: 'images'}).single('image'))

app.use('/api/', authRoute)

app.use('/api/users', userRouter)

app.use('/api/ingredients', ingredientRouter)

app.listen(3000, () => console.log('Server Started'))


