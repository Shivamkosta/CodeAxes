const User = require("../models/user");
const jwt = require("jsonwebtoken"); // to generate signed token
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    
     console.log("signup is running");
    const user = new User(req.body);
    console.log(user);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        //user.hashed_password = undefined;
        //user.confirm_password = undefined;

        res.json({
            user
        });
    });
};

exports.signin = (req, res) => {
    console.log("signin api is running...")
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        console.log("generate token :"+token);
        // persist the token as 'token' in cookie with expiry date
        res.cookie("token", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.forgetpass = (req,res,next)=>{
    console.log("forget password");

    //const { email, password ,confpassword } = req.body;
    User.findOne({ email:req.body.email},(err,data)=>{
        console.log("user :",data);
        if( !data){
            return res.status(403).json({
                error : 'This Email is not registered!!'
            })
        }
        // else if (!user.authenticate(password,confpassword)) {
        //     return res.status(401).json({
        //         error: "Email and password dont match"
        //     });
        // }
        else if(req.body.password === req.body.confpassword){ 
                 data.password = req.body.password;
                 data.confpassword = req.body.confpassword;

            data.save((err,person)=>{
                console.log("perosn :",person )
                if(err){
                    console.log(err)
                }
                else{
                    console.log("success");
                    res.send({
                        "Success" : "Password has been changed Successfully :)",
                        person
                    })
                }
            })
        }
        else{
            res.send({
                "Success": "Password does not matched! Both Password should be same.",
                            
            })
        }

        
    })
}

exports.signout = (req, res, next) => {
    console.log("logout!!");
    res.clearCookie("token");
    res.json({ message: "Signout success" });

    if(req.session){
        //delete session object
        req.session.destroy(err=>{
            return next(err);
        })
    }else{
        return res.send({
            message : 'Logout User Successfully...'
        })
    }
};

