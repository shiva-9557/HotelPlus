const User=require("../models/user");


module.exports.getsignup=(req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.postsignup=async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","User was registered successfully");
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","Sign up succesfully!")
            res.redirect("/listings");
        }
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.getlogin=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.postlogin=async (req,res)=>{
    req.flash("success","logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.glogout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};