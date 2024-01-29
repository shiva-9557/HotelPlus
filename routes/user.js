const express = require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsyncs");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.getsignup)
.post(userController.postsignup);

router
.route("/login")
.get(saveRedirectUrl,userController.getlogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),userController.postlogin);

router.get("/logout",userController.glogout);

module.exports=router;