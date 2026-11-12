import User from "../models/userModels.js"
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtwebtoken.js"


// register
export const userRegister = async(req,res)=>{
  try{
    const {fullname,username,email,gender,password,profilepic} = req.body;

    const user = await User.findOne({
      $or:[{username},{email}]
    }) ;

    if(user) return res.status(400).send({success:false,message:"Username or Email Already Exist"});
    
    const hashPassword = bcryptjs.hashSync(password,10);

    const profileBoy = profilepic || `https://avatarapi.runflare.run/public/boy?username=${username}`;

    const profileGirl = profilepic || `https://avatarapi.runflare.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password:hashPassword,
      gender,
      profilepic:gender==="male"?profileBoy:profileGirl
    });

    if(newUser){
      //create JWT
      await newUser.save();
      jwtToken(newUser._id,res);
    }
    else{
      res.status(500).send({success:false,message:"Invalid User Data"});
    }
    res.status(201).send({
      _id:newUser._id,
      fullname:newUser.fullname,
      username:newUser.username,
      email:newUser.email,


    })
  }
  catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:error.message
    });
  }
}


// login 
export const userLogin = async(req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user) return res.status(500).send({success:false,message:"Email Doesn't Exist Register"});

    const comparePass = bcryptjs.compareSync(password,user.password || "");

    if(!comparePass) return res.status(500).send({success:false,message:"Email or password Doesn't matching"});

    jwtToken(user._id,res);
    
    res.status(200).send({
      _id:user._id,
      fullname:user.fullname,
      username:user.username,
      email:user.email,
      message:"Successfully Login"

    })
  }
  catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:message.error
    });
  }
}



export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development"
    });

    return res.status(200).send({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};
