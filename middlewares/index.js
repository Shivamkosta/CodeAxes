const expressJwt = require("express-jwt"); // for authorization check


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    console.log("isAuth user : "+user);
    console.log("isAuth profile : "+req.profile);
    console.log("isAuth auth :"+req.auth);
    console.log("isAuth profile_id :"+req.profile._id);
    console.log("isAuth id :"+req.auth._id);
    if (!user) {
        console.log("isAuth")
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    console.log(req.profile)
    if (req.profile.role === 0) {
        console.log("user");
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};
