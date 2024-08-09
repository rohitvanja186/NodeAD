const { blogs } = require("../../model")

exports.renderCreateBlog = (req, res) => {
    res.render("createBlog.ejs")
}

exports.createBlog = async (req, res) => {

    // first approach
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description

    await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description
    })

    // second approach
    // const {title, subTitle, description} = req.body
    console.log(title, subTitle, description)

    // data ma halnu paryo
     
    res.redirect("/")
}


exports.allBlog = async (req, res) => {
    // blogs bhaney table bata bhako jati sab data blogs bhanney page ma lyaidey
    const allBlogs = await blogs.findAll()
    console.log(allBlogs)

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
    console.log(req.body)
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