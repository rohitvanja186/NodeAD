const { blogs } = require("../model")

exports.isValidUser = async (req,res,next)=>{
    const userId = req.userId
    const id = req.params.id

    const oldDatas = await blogs.findAll({
        where: {
            id: id
        }
    })

    // Check if the logged-in user is the owner of the blog
    if(oldDatas[0].userId !== userId){
        return res.send("you cannot edit or delete this blog")
    }


    // Pass the blog data to the next middleware
    req.oldDatas = oldDatas;

    next()
} 