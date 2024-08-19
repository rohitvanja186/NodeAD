const { users } = require("../model")
const { decodeToken } = require("../services/decodeToken")

exports.isAuthenticated = async (req,res,next) => {
    const token = req.cookies.token

    // check if token given or not
    if(!token){
        return res.redirect("/login")
    }

    // Verify token if it is legit or not 
    const decryptedResult = await decodeToken(token,process.env.SECRETKEY)
    console.log(decryptedResult)


    // check if that id(userId) users table ma exist xa
    const usersExists = await users.findAll({
        where : {
            id : decryptedResult.id
        }
    })

    // zero xa bhaney user exist gardaina
    if(usersExists.length == 0){
        res.send("User with that token doesn't exist")
    }else{
        req.user = usersExists  //decryptedResult.id  
        req.userId = usersExists[0].id
        next();
    }


}