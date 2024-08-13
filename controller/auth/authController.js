const { users } = require("../../model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.renderRegisterForm = (req,res) => {
    res.render("register.ejs")
}

exports.registerUser = async(req,res) => {
    const {email, username, password, confirmPassword} = req.body


    // check if password matches with confirmPassword
    // if(password.toLowerCase() !== confirmPassword.toLowerCase()) {
    //     return res.send("Password and confirmPassowrd doesn't matched")
    // }


    if(password !== confirmPassword) {
        return res.send("Password and confirmPassowrd doesn't matched")
    }

    // Insert into table users
    await users.create({
        email : email,
        username : username,
        password : bcrypt.hashSync(password,8)
    })

    res.redirect("/login")
}


// LOGIN STARTS FROM HERE
exports.renderLoginForm = (req,res) => {
    res.render("login.ejs")
}

exports.loginUser = async (req,res) => {
    console.log(req.body)

    const {email,password} = req.body

    // SERVER SIDE VALIDATION
    if(!email || !password){
        return res.send("Email and password are required")
    }

    // Check if that email exist or not
    const associatedDatawithEmail = await users.findAll({
        where : {
            email : email
        }
    })

    if(associatedDatawithEmail.length == 0){
        res.send("User with that email doesn't exists")
    }else{
        // check if passowrd also matches
        const associatedEmailPassword = associatedDatawithEmail[0].password
        const isMatched = bcrypt.compareSync(password,associatedEmailPassword)  // true or false return garxa
        if(isMatched){
            // Generate token here
            const token = jwt.sign({id:associatedDatawithEmail[0].id},process.env.SECRETKEY,{
                expiresIn : "30d"
            })
            res.cookie('token',token)

            res.send("logged in success")
        }else{
            res.send("Invalid password")
        }
    }
}