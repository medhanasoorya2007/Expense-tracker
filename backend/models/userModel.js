import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },

});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;