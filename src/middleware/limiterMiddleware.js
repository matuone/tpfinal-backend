// Middleware de rate limit para /auth/login
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // máximo 5 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Demasiados intentos de login",
      context: "Has superado el límite de 5 intentos en 15 minutos. Intenta nuevamente más tarde."
    });
  }
});

export { loginLimiter };