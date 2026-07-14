import User from "../models/userModel.js";
import Validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

//TOKEN
const JWT = process.env.JWT_SECRET;
const createToken = (userId) => {
    return jwt.sign({id: userId}, JWT, {expiresIn: '12d'});
}

//REGISTER A USER
export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if(!name || !email || !password ){
        return res.json({
            success: false,
            message: "All fields are required"
        })
    }
    if(!Validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        })
    }
    if(password.length < 8){
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        })
    }

    try{
        if(await User.findOne({email})){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed});
        const token = createToken(user._id);
        res.status(201).json({
            success:true,
            token,
            user :{ id: user._id, name: user.name, email: user.email }
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//LOGIN A USER
export async function loginUser(req, res) {
    const  {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Both email and password are required"
        })
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "email or password is incorrect"
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Email or password is incorrect"
                });
            }
            const token = createToken(user._id);
            res.status(200).json({
                success: true,
                token,
                user: { id: user._id, name: user.name, email: user.email }
            });
        }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//GET USER PROFILE
export async function getUserProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select('name email');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
        success: true,
        user
});
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//UPDATE USER PROFILE

export async function updateUserProfile(req, res) {
    const {email, name} = req.body;
    if(!email || !name || !Validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Both email and name are required"
        });
    }
    try {
        const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { email, name },
            { new: true, runValidators: true }
        ).select('name email');
        res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
    
}

//UPDATE PASSWORD

export async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password is invalid or too short"
        });
    }
    try {
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}