import mongoose from "mongoose";

function connectDB() {
  try {
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(console.log("connected to db"));
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
