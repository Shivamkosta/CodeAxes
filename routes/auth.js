const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    forgetpass,
    signout,
    
} = require("../controllers/auth");

//custom middlewares
const { requireSignin, isAuth, isAdmin } = require("../middlewares/index");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin",  signin);
router.post("/forgetpass",forgetpass)
router.get("/signout", signout);

module.exports = router;
