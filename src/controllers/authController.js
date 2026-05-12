import { User } from "../models/User.js";
import { Ticket } from "../models/Ticket.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SAMPLE_TICKETS = [
  {
    title: "No se guarda un lugar cuando rechazo geolocalización",
    description: "Al negar permisos de ubicación, la app informa el error pero el usuario no recibe una alternativa clara para registrar el lugar manualmente.",
    type: "bug",
    priority: "alta",
    status: "abierto",
  },
  {
    title: "Agregar etiquetas a los lugares favoritos",
    description: "Se necesita clasificar lugares por categorías como café, plaza o trabajo para mejorar la búsqueda futura.",
    type: "mejora",
    priority: "media",
    status: "en_progreso",
  },
  {
    title: "Consulta sobre expiración de sesión",
    description: "Un usuario pregunta cada cuánto tiempo vence el token y qué pasa si vuelve a abrir la app al día siguiente.",
    type: "consulta",
    priority: "baja",
    status: "resuelto",
  },
  {
    title: "El mapa no centra el último lugar registrado",
    description: "Después de guardar un nuevo punto, el mapa permanece en la vista inicial y dificulta validar visualmente el alta.",
    type: "bug",
    priority: "media",
    status: "abierto",
  },
  {
    title: "Métrica de errores de autenticación en dashboard",
    description: "Producto solicita exponer una métrica simple de fallos de login para evaluar fricción de acceso en post-lanzamiento.",
    type: "mejora",
    priority: "alta",
    status: "en_progreso",
  },
];

const register = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Missing request body" });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Crear tickets de ejemplo para que el usuario vea la sección de soporte completa
    await Ticket.insertMany(
      SAMPLE_TICKETS.map((ticket) => ({ ...ticket, userId: newUser._id }))
    );

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "mi_clave_secreta",
      { expiresIn: "1h" } // duración de la sesión 
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "mi_clave_secreta",
      { expiresIn: "1h" } // duración de la sesión
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { register, login };
