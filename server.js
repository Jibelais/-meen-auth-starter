// Dependencies
const express = require("express")
const app = express()
require("dotenv").config()
const session = require("express-session")
const sessionsRouter = express.Router()
const userController = require("./controllers/users")
const sessionsController = require("./controllers/sessions")
const methodOverride = require("method-override")


const mongoose = require("mongoose")
// const bcrypt = require('bcrypt')
// const hashedString = bcrypt.hashSync("yourPasswordStringHere", bcrypt.genSaltSync(10))

// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Database Connection Error / Success
const db = mongoose.connection
db.on("error", (err) => console.log(err.message + " is mongod not running?"))
db.on("connected", () => console.log("mongo connected"))
db.on("disconnected", () => console.log("mongo disconnected"))

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
  
// Routes / Controllers
app.use("/users", userController)
app.use(session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    })
  )
app.use("/sessions", sessionsController)



app.get("/", (req, res) => {
    if (req.session.currentUser) {
      res.render("dashboard.ejs", {
        currentUser: req.session.currentUser,
      })
    } else {
      res.render("index.ejs", {
        currentUser: req.session.currentUser,
      })
    }
  })
  




// Listener
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`))

