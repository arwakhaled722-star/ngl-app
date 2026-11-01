import {Schema,model} from "mongoose";
const userSchema=new Schema(
      {
        name:{
        type:String,
        required: true,
        minlength:3,
        maxlength:20,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim:true,
        lowercase:true
    },
    password:{
        type: String,
        required: function(){
            return this.provider === "local";
        },
    },
    provider:{
        type:String,
        enum:["local","google","facebook"],
        default:"local"
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isBanned: {
    type: Boolean,
    default: false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    dob:  Date,
    gender:{
        type:String,
        enum:['male','female'],
        default:'female'

   },profilePicPath:String,
    coverImagePaths:[String],
    cvPath:String,
    },
      {

         timestamps:{
            createdAt:true,
            updatedAt:true
        }

}
);
export const user = model('user',userSchema);   
