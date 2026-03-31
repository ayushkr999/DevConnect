import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email address: "+value)
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // never return password
    },
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
photoUrl: {
  type: String,
  validate(value) {
    if (value && !validator.isURL(value)) {
      throw new Error("Invalid Photo url: " + value);
    }
  }
}
,
 skills:{
      type:[String]
    },
    AboutUs:{
      type:String
    },
  },
  {
    timestamps: true, 
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});  

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password);
};

userSchema.methods.generateAuthToken =async function () {
  return jwt.sign(
     { _id: this._id },  
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
const User=mongoose.model("User",userSchema);
export default User;
