import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
    //GRAB THE TOKEN FROM HEADER
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success: false,
            message: "Not authorized or Token is missing"
        })
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT);
        const user = await User.findById(payload.id).select('-password');
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("JWT verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid token or token expired"
        })
    }
}