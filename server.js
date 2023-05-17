require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const errorHandler = require('./middleware/error-handler')
const multer = require('multer')
const cors = require('cors')
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




mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
mongoose.set('useCreateIndex', true);
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


//add routes variables
const userRouter = require('./routes/users')
const authRoute = require('./routes/auth')
const ingredientRouter = require('./routes/ingredients')
const recetteRouter = require('./routes/recettes')
const categoryRouter = require('./routes/categories')
const foodRouter = require('./routes/foods')
const commentRouter = require('./routes/comments')
const areaRouter = require('./routes/areas')




app.use(cors())
app.use(express.json())

//app.use(multer({dest: 'images'}).single('image'))


// use routes
app.use('/api/', authRoute)

app.use('/api/users', userRouter)

app.use('/api/ingredients', ingredientRouter)

app.use('/api/recettes', recetteRouter)

app.use('/api/categories', categoryRouter)

app.use('/api/food', foodRouter)

app.use('/api/comments', commentRouter)

app.use('/api/areas', areaRouter)

app.use(errorHandler.notFound)
app.use(errorHandler.errorHandler)


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


app.listen(3000, () => console.log('Server Started on port 3000'))
