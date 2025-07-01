const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const md5 = require('md5');
const generateHelper = require("../../../../helpers/generate.helper");
const sendMailHelper = require("../../../../helpers/sendmail.helper");

//[POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    const password = md5(req.body.password);
    const email = req.body.email;
    const fullName = req.body.fullName;
    
    const existEmail = await User.findOne({ 
        email: email, 
        deleted: false });
    if (existEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
    }
    
    const user = new User({
        email: email,
        password: password,
        fullName: fullName,
        token: generateHelper.generateRandomString(41),
    });
    await user.save();

    res.cookie("token", user.token)
    res.json({
        code: 200,
        message: "User registered successfully",
    });

}

//[POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);


    const user = await User.findOne({
        email: email,
        deleted: false, });
    
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }


    if (user.password != password) {
        res.status(400).json({ message: "Incorrect password" });
        return;
    }

    res.cookie("token", user.token);

    res.json({
        code: 200,
        message: "Login successful",
        token: user.token,
    });
}

//[POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    try{
        const user = await User.findOne({
            email: email,
            deleted: false,
        });
        if (!user) {
            res.status(404).json({ message: "Email not found" });
            return;
        }
        const otp = generateHelper.generateRandomNumber(6);

        const otpExpire = 5;

        const data = {
            email: email,
            otp: otp,
            expireAt: new Date(Date.now() + otpExpire * 60 * 1000), // 5 minutes
        };

        const record = new ForgotPassword(data);

        await record.save();


        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;

        sendMailHelper.sendMail(email, subject, text);
    
        res.json({
            code: 200,
            message: "OTP sent to email",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//[POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const record = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });
    if (!record) {
        res.status(404).json({ message: "Invalid OTP" });
        return;
    }

    if (record.expireAt < new Date()) {
        res.status(400).json({ message: "OTP expired" });
        return;
    }
    const user = await User.findOne({
        email: email
    });



    res.cookie("token", user.token);
    res.json({
        code: 200,
        message: "OTP verified successfully",
        token: user.token,
    });

}

//[POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {

    const password = req.body.password;
    const token = req.cookies.token;


    const record = await User.findOne({
        token: token,
    });

    if (md5(password) == record.password) {
        res.status(400).json({ message: "New password cannot be the same as the old password" });
        return;
    }

    await User.updateOne({
        token: token,
    }, {
        password: md5(password),
    });

    res.json({
        code: 200,
        message: "Password reset successfully",
    });


}

//[GET] /api/v1/users/profile
module.exports.profile = async (req, res) => {
    // const token = req.cookies.token;
    // const user = await User.findOne({
    //     token: token,
    //     deleted: false,
    // }).select("-password -token");

    res.json({
        code: 200,
        message: "User profile retrieved successfully",
        profile: req.user // Assuming loginAuth middleware sets req.user
    });
}