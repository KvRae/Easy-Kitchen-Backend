require('dotenv').config()
<<<<<<< HEAD
const bodyParser = require('body-parser')
=======
>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5

const express = require('express')
const app = express()
const mongoose = require('mongoose')
<<<<<<< HEAD

const multer = require('multer')
fs = require('fs-extra')
app.use(bodyParser.urlencoded({ extended: true }))


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})

var upload = multer({ storage: storage })




mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

=======
const multer = require('multer')



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,useUnifiedTopology:true })
const db = mongoose.connection




>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


//add routes variables
const userRouter = require('./routes/users')
const authRoute = require('./routes/auth')
const ingredientRouter = require('./routes/ingredients')
const recetteRouter = require('./routes/recettes')
const categoryRouter = require('./routes/categories')
const foodRouter = require('./routes/foods')
<<<<<<< HEAD
const commentRouter = require('./routes/comments')
=======
const areaRouter = require('./routes/areas')
>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5



app.use(express.json())
<<<<<<< HEAD
//app.use(multer({dest: 'images'}).single('image'))

// use routes

=======
app.use(multer({dest: 'images'}).single('image'))

// use routes
>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5
app.use('/api/', authRoute)

app.use('/api/users', userRouter)

app.use('/api/ingredients', ingredientRouter)

app.use('/api/recettes', recetteRouter)

app.use('/api/categories', categoryRouter)

<<<<<<< HEAD
app.use('/api/foods', foodRouter)

app.use('/api/comments', commentRouter)


// Upload Single File
app.post('/api/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      console.log("error", 'Please upload a file');
      
      res.send({code:500, msg:'Please upload a file'})
      return next({code:500, msg:error})
  
    }
    res.send({code:200, msg:file})
  })
=======
app.use('/api/food', foodRouter)

app.use('/api/areas', areaRouter)
>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5

app.listen(3000, () => console.log('Server Started'))
