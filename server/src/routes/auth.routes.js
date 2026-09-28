import { Router } from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import {
	getMe,
	login,
	logout,
	refresh,
	register,
} from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/refresh", refresh);
router.get("/getme", authenticate, getMe);
router.post("/logout", authenticate, logout);

export default router;
