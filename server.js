require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const multer = require('multer')



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,useUnifiedTopology:true })
const db = mongoose.connection




db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


//add routes variables
const userRouter = require('./routes/users')
const authRoute = require('./routes/auth')
const ingredientRouter = require('./routes/ingredients')
const recetteRouter = require('./routes/recettes')
const categoryRouter = require('./routes/categories')
const foodRouter = require('./routes/foods')
const areaRouter = require('./routes/areas')



app.use(express.json())
app.use(multer({dest: 'images'}).single('image'))

// use routes
app.use('/api/', authRoute)

app.use('/api/users', userRouter)

app.use('/api/ingredients', ingredientRouter)

app.use('/api/recettes', recetteRouter)

app.use('/api/categories', categoryRouter)

app.use('/api/food', foodRouter)

app.use('/api/areas', areaRouter)

app.listen(3000, () => console.log('Server Started'))
