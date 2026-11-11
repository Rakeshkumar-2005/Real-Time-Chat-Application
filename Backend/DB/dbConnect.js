import mongoose from "mongoose";

const dbConnect = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully");
  }
  catch(err){
    console.log(err);
  }
}

export default dbConnect