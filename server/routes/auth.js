import express from "express";
import {login} from "../controllers/auth.js"

const router = express.Router(); 


router.use("/login",login);
//console.log("Login","Cant Login")

export default router;