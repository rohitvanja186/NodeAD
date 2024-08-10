const { users } = require("../../model")
const bcrypt = require("bcrypt")

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

exports.loginUser = (req,res) => {
    console.log(req.body)
}