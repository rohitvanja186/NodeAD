const express = require("express") // requiring express package
const { blogs } = require("./model/index")
const { renderCreateBlog, createBlog, allBlog, singleBlog, deleteBlog, editBlog, renderEditBlog } = require("./controller/blog/blogController")
const app = express() // storing it in app, app vannay variable throughout use garxum

// ROUTES HERE
const blogRoute = require("./routes/blogRoute")


// database connection
require("./model/index")

// ma ejs use garna lageko xu, k k chaiyeney ho environment set gardey
app.set("view engine", "ejs")


// nodejs lie file access garna dey
app.use(express.static("public/"))
 
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


app.use("",blogRoute) // localhost:300 + /createBlog === localhost:3000/createBlog


// server listening
app.listen (3000, () => {
    console.log("the project started in 3000 port")
}) 