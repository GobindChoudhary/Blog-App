import express from "express";
import authController from "../controllers/auth.controller.js";
const { registerController, signinController, googleAuthController } =
  authController;
const router = express.Router();

router.post("/signup", registerController);
router.post("/signin", signinController);
router.post("/google-auth", googleAuthController);

export default router;
