const { blogs, users } = require("../../model")
const fs = require("fs")  // fs:fileSystem

exports.renderCreateBlog = (req, res) => {
    res.render("createBlog.ejs")
}

exports.createBlog = async (req, res) => {
    const userId = req.user[0].id

    // first approach
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description
    const filename = req.file.filename

    if (!title || !description || !subTitle || !req.file) {
        return res.send("Please provide title, subTitle, description, file")
    }

    await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description,
        userId: userId,
        image: process.env.PROJECT_URL + filename
    })

    // second approach
    // const {title, subTitle, description} = req.body

    // data ma halnu paryo

    res.redirect("/")
}


exports.allBlog = async (req, res) => {
    // blogs bhaney table bata bhako jati sab data blogs bhanney page ma lyaidey
    const allBlogs = await blogs.findAll({
        include: {
            model: users
        }
    })


    // blogs vanney key naam ma allBlogs varaible ko value pass gareko blogs.ejs file ma
    res.render("blogs.ejs", { blogs: allBlogs })
}



exports.singleBlog = async (req, res) => {

    // first approach
    const id = req.params.id

    // 2nd approach..destructuring
    // const {id} = req.params


    // id ko dasta magnu paryo hamro store bhako table bata
    const blog = await blogs.findAll({
        where: {
            id: id
        },
        include: {
            model: users
        }
    })


    // 2nd finding approach
    // const blog = await blogs.findByPk(id)


    console.log(blog)

    res.render("singleBlog.ejs", { blog: blog })
}



exports.deleteBlog = async (req, res) => {
    const id = req.params.id;
    const oldDatas = req.oldDatas; // Get old data from req passed from isValidUser middleware

    // Delete the blog from the database
    await blogs.destroy({
        where: {
            id: id
        }
    });

    // Optionally, delete the associated image file
    const oldImagePath = oldDatas[0].image;
    const lengthOfUnwanted = "http://localhost:3000/".length;
    const fileNameInUploadFolder = oldImagePath.slice(lengthOfUnwanted);

    fs.unlink('uploads/' + fileNameInUploadFolder, (err) => {
        if (err) {
            console.log("Error while deleting file", err);
        } else {
            console.log("File deleted successfully");
        }
    });

    res.redirect('/');
};




exports.renderEditBlog = async (req, res) => {
    // first approach
    const id = req.params.id

    // find blog of that id
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })

    res.render("editBlog.ejs", { blog: blog })
}



exports.editBlog = async (req, res) => {
    // const userId = req.userId
    const id = req.params.id
    const title = req.body.title
    const subTitle = req.body.subtitle
    const description = req.body.description
    const oldDatas = req.oldDatas   // Get old data from req passed from isValidUser middleware
    // const oldDatas = await blogs.findAll({
    //     where: {
    //         id: id
    //     }
    // })

    // if(oldDatas[0].userId !== userId){
    //     return res.send("you cannot edit this blog")
    // }

    // here we must have to use var or let instead of const because we have to reasign it again
    let fileUrl;
    if (req.file) {
        fileUrl = process.env.PROJECT_URL + req.file.filename


        // Delete old image if a new one is uploaded
        const oldImagePath = oldDatas[0].image
        // console.log(oldImagePath)   // http://localhost:3000/1723654479881-random.png
        const lengthOfUnwanted = "http://localhost:3000/".length
        const fileNameInUploadFolder = oldImagePath.slice(lengthOfUnwanted)  // lengthOfUnwanted = 32 

        fs.unlink('uploads/' + fileNameInUploadFolder, (err) => {
            if (err) {
                console.log("Error while deleting file", err)
            } else {
                console.log("File Delete successfully")
            }
        })
    } else {
        fileUrl = oldDatas[0].image    // old fileUrl
    }

    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description,
        image: fileUrl
    }, {
        where: {
            id: id
        }
    })

    res.redirect('/single/' + id)
}


exports.renderMyBlogs = async (req, res) => {
    // get this users blogs
    const userId = req.userId


    // find blogs of this user id
    const myBlogs = await blogs.findAll({
        where: {
            userId: userId
        }
    })

    res.render("myBlogs.ejs", { myBlogs: myBlogs })
}