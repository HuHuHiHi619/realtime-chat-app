import { Router } from "express";
import { AuthController } from "../controllers/authController"
import { AuthRepository } from "../repositories/AuthRepository";
import { AuthService } from "../services/authService";
import { validateRequest } from "../middlewares/validationReq";
import { loginSchema, registerSchema } from "@shared/schema/auth.schema.schema";


const router = Router()

// --- Manual DI ---
const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

// --- Routes ---
    // Register
    router.post(
        "/register",
        validateRequest({ body : registerSchema }),
        authController.register.bind(authController)
    );
    
    // Login
    router.post(
        "/login",
        validateRequest({ body : loginSchema }),
        authController.login.bind(authController)
    )
    
    // Logout
    router.post(
        "/logout",
        authController.logout.bind(authController)
    )


    // RefreshToken
    router.get(
        "/refreshToken",
        authController.refreshCookies.bind(authController)
    )

export default router