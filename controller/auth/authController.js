const { users } = require("../../model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendEmail = require("../../services/sendEmail")

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
            res.redirect("/")
        }else{
            res.send("Invalid password")
        }
    }
}


// LOGOUT STARTS HERE
exports.logOut = (req,res) => {
    res.clearCookie('token')
    res.redirect('/login')
}


// forgot password
exports.forgotPassword = (req,res) => {
    res.render("forgotPassword.ejs")
}


exports.checkForgotPassword = async (req,res) => {
    const email = req.body.email

    if(!email){
        return res.send("Please provide email")
    }

    // // tala ko mass notification sanga connected xa
    // const allUsers = await users.findAll()

    // if email -> users Table check with that email
    const emailExists = await users.findAll({
        where : {
            email : email
        }
    })

    if(emailExists.length == 0){
        res.send("User with that email doesn't exist")
    }else{
        const generatedOtp = Math.floor(10000 * Math.random(9999))
        console.log(generatedOtp)
        // tyo email ma otp pathauney
        await sendEmail({
            email: email,
            subject: "Forgot Password OTP",
            otp: generatedOtp
        })

        emailExists[0].otp = generatedOtp
        emailExists[0].otpGeneratedTime = Date.now()
        await emailExists[0].save()

        res.redirect('/otp?email=' + email)

        // // mass notification pathaunu ko lagi
        // for(var i = 0; i< allUsers.length; i++){
        //     await sendEmail({
        //         email: allUsers[0].email,
        //         subject: "This is bulk gmail",
        //         otp: "This is to notify that we are closing soon"
        //     })
        // }
    }
}

exports.renderOtpForm = (req,res)=>{
    const email = req.query.email
    res.render("otpForm",{email : email})
}


exports.handleOTP = async (req,res)=>{
    const otp = req.body.otp
    const email = req.params.id
    if(!otp || !email){
        return res.send("Please send email,otp")
    }
    const userData = await users.findAll({
        where : {
            email : email,
            otp : otp
        }
    })

    if(userData.length == 0){
        res.send("Invalid OTP")
    }else{
        const currentTime = Date.now()  // current time
        const otpGeneratedTime = userData[0].otpGeneratedTime  // past time
        if(currentTime - otpGeneratedTime <= 120000){
            // userData[0].otp = null
            // userData[0].otpGeneratedTime = null
            // await userData[0].save()

            
            // res.redirect("/passwordChange?email=" + email)
            res.redirect(`/passwordChange?email=${email}&otp=${otp}`)
        }else{
            res.send("OTP had been expired")
        }
    }
    console.log(otp,email)
}


exports.renderPassowrdChangeForm = (req,res) => {
    const email = req.query.email
    const otp = req.query.otp
    if(!email || !otp){
        return res.send("Email and otp should be provided in the query")
    }
    res.render("passwordChangeForm.ejs",{email,otp})
}



exports.handlePasswordChange = async (req,res)=>{
    const email = req.params.email
    const otp = req.params.otp

    const newPassword = req.body.newPassword
    const confirmNewPassword = req.body.confirmNewPassword
    if(!newPassword || !confirmNewPassword || !email ||!otp){
        return res.send("Please provide newPassword, email and confirmPassword")
    }

    // checking if that emails otp or not
    const userData = await users.findAll({
        where : {
            email : email,
            otp : otp
        }
    })

    if(newPassword !== confirmNewPassword) {
        return res.send("newPassowrd and confirmPassowrd doesn't matched")
    }

    if(userData.length == 0){
        return res.send("Don't try to do this")
    }

    const currentTime = Date.now()
    const otpGeneratedTime = userData[0].otpGeneratedTime
    if(currentTime - otpGeneratedTime >= 120000){
        return res.send("Passowrd Reset Time has Expired")
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword,8)
    // // Match vayo vaney

    // // FIND GARERA UPDATE GARXA
    // const userData = await users.findAll({
    //     email : email
    // })

    // userData[0].password = hashedNewPassword
    // await userData[0].save

    // DIRECT UPDATE GARXA.......jun garda ni bhayo
    await users.update({
        password : hashedNewPassword
    },{
        where : {
            email : email
        }
    })
    res.redirect("/login")
}