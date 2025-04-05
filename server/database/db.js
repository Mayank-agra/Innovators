// import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();


// export const connectDb=async()=>{
//     console.log("DB Connection String:", process.env.DB); // Add this line
//     try {
//         const conn=await  mongoose.connect(process.env.DB);
//         console.log(MongoDB connected: ${conn.connection.host});
//      } catch (error) {
//         console.log(Mongodb connection error: ${error.message});
//     }
// };