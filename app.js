const express = require("express") // requiring express package
const app = express() // storing it in app, app vannay variable throughout use garxum
require("dotenv").config() // requiring dotenv and initializing it with default configuration
const cookieParser = require("cookie-parser")

// ROUTES HERE 
const blogRoute = require("./routes/blogRoute")
const authRoute = require("./routes/authRoute")


// database connection
require("./model/index")

// ma ejs use garna lageko xu, k k chaiyeney ho environment set gardey
app.set("view engine", "ejs")


// nodejs lie file access garna dey
app.use(express.static("public/"))
app.use(express.static("uploads/"))
 
app.use(cookieParser())

//form bata data aae raxa parse garr nabhaye handle garr
app.use(express.json())
app.use(express.urlencoded({extended:true}))



// //all blogs
// app.get('/',allBlog)

// //create blog
// app.get('/createBlog',renderCreateBlog)


// //create Blog post
// app.post('/createBlog',createBlog)


// // single blog page
// app.get('/single/:id',singleBlog)


// // delete blog
// app.get('/delete/:id',deleteBlog)


// // edit blog
// app.get('/edit/:id',renderEditBlog)


// //edit blog post
// app.post('/editBlog/:id',editBlog)


app.use("",authRoute)
app.use("",blogRoute) // localhost:300 + /createBlog === localhost:3000/createBlog


// server listening
app.listen (3000, () => {
    console.log("the project started in 3000 port")
}) 