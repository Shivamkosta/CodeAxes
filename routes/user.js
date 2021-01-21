const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../middlewares/index");
const { userById } = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    
    });
    console.log('shivam')
});


router.param("userId", userById);

module.exports = router;
