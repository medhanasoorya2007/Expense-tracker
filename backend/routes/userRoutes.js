import express from 'express';
import {updateUserProfile, getUserProfile, loginUser, registerUser, updatePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//PROTECTED ROUTE
userRouter.get("/me", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.put("/password", authMiddleware, updatePassword);

export default userRouter;