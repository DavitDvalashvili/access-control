import express from "express";
import { checkPassword, isUserLoggedIn, logOutUser, loginUser } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.get("/checkpassword", checkPassword);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logOutUser);
userRouter.get("/checkuser", isUserLoggedIn);

export default userRouter;