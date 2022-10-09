import express from "express";
import {test,getUser,signup,signin,updateUser,deleteUser} from "../controllers/userController.js";
const userRouter = express.Router();


userRouter.get('/',updateUser);
userRouter.post('/signup',signup);
userRouter.post('/signin',signin);
userRouter.get('/:id',getUser);


export default userRouter;