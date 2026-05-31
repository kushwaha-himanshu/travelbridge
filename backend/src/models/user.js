import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
    
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
   password: {
  type: String,
  required: function () {
    return this.authProvider === "local";
  }
},authProvider: {
  type: String,
  enum: ["local", "google"],
  default: "local"
},
    resetToken: String,
    resetTokenExpiry: Date,
}, { timestamps: true });   

const User = mongoose.model("User", userSchema);

export default User;