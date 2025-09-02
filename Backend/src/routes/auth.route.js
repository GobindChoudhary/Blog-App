import express from "express";
import authController from "../controllers/auth.controller.js";
const { registerController, signinController } = authController;
const router = express.Router();

router.post("/signup", registerController);
router.post("/signin", signinController);

export default router;
