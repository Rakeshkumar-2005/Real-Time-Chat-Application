import User from "../models/userModels.js"
import bcryptjs from "bcryptjs";

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
      await newUser.save();
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
      message:message.error
    });
  }
}