// Middleware de rate limit para /auth/login
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 100, // máximo 100 intentos por IP por hora (muy generoso)
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Permitir requests en desarrollo o si hay IP de Render
    return process.env.NODE_ENV === 'development' || req.ip?.includes('127.0.0.1');
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Demasiados intentos de login",
      context: "Has superado el límite de intentos por hora. Intenta nuevamente más tarde."
    });
  }
});

export { loginLimiter };