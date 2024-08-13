const { blogs, users } = require("../../model")

exports.renderCreateBlog = (req, res) => {
    res.render("createBlog.ejs")
}

exports.createBlog = async (req, res) => {
    const userId = req.user[0].id

    // first approach
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description

    await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description,
        userId: userId
    })

    // second approach
    // const {title, subTitle, description} = req.body

    // data ma halnu paryo
     
    res.redirect("/")
}


exports.allBlog = async (req, res) => {
    // blogs bhaney table bata bhako jati sab data blogs bhanney page ma lyaidey
    const allBlogs = await blogs.findAll({
        include : {
            model : users
        }
    })


    // blogs vanney key naam ma allBlogs varaible ko value pass gareko blogs.ejs file ma
    res.render("blogs.ejs", {blogs:allBlogs})
}



exports.singleBlog = async (req, res) => {

    // first approach
    const id = req.params.id

    // 2nd approach..destructuring
    // const {id} = req.params


    // id ko dasta magnu paryo hamro store bhako table bata
    const blog = await blogs.findAll({
        where : {
            id : id 
        },
        include : {
            model : users
        }
    })


    // 2nd finding approach
    // const blog = await blogs.findByPk(id)


    console.log(blog)

    res.render("singleBlog.ejs",{blog:blog})
}



exports.deleteBlog = async (req, res) => {
    const id = req.params.id

    // blogs bhanney table bata tyo id ko data delete garr
    const data = await blogs.destroy({
        where : {
            id : id
        }
    })
    res.redirect('/')
}



exports.renderEditBlog = async (req, res) => {
    // first approach
    const id = req.params.id

    // find blog of that id
    const blog = await blogs.findAll({
        where : {
            id : id 
        }
    })

    res.render("editBlog.ejs", {blog : blog})
}



exports.editBlog = async (req,res) => {
    const id = req.params.id
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description

    await blogs.update({
        title : title,
        subTitle : subTitle,
        description : description
     }, {
        where : {
            id : id
        }
     })

     res.redirect('/single/' + id)
}


exports.renderMyBlogs = async (req,res) => {
    // get this users blogs
    const userId = req.userId

    // find blogs of this user id
    const myBlogs = await blogs.findAll({
        where : {
            userId : userId
        }
    })

    res.render("myBlogs.ejs",{myBlogs : myBlogs})
}