import { Router } from "express"
import { login, register } from "../controllers/authController.js"
import { loginLimiter } from "../middleware/limiterMiddleware.js";

const router = Router();

// Aquí irán las rutas relacionadas con "auth"
router.post("/login", loginLimiter, login)

// POST → http://localhost:3000/auth/register → { email, password }
router.post("/register", register)

export { router }