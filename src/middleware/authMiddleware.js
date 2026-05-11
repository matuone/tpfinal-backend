import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // El token suele venir en el header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verificar token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mi_clave_secreta");
    req.user = decoded; // Guardamos info del usuario en la request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export { authMiddleware };
