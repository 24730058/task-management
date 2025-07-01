const User = require("../../api/v1/models/user.model");

module.exports.loginAuth = async (req, res, next) => {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password -token");
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
            } else {
                // Lưu thông tin user vào req để controller có thể sử dụng
                req.user = user;
                next();
            }
    }   else {
                res.status(401).json({ message: "token not found" });
            }
}