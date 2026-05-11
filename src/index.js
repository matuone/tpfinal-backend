import express from "express";
import cors from "cors";
import { connectDb } from "./config/mongodb.js";
import { router as placesRouter } from "./routes/placesRouter.js";
import { router as authRouter } from "./routes/authRouter.js";
import { router as supportRouter } from "./routes/supportRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { errorLoggerMiddleware } from "./middleware/errorLoggerMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Importante para producción (Render, Vercel, etc) - permite leer IP real
app.set('trust proxy', 1);

app.use(express.json());
app.use(cors());

// Usar el logger modularizado
app.use(errorLoggerMiddleware);

app.use("/auth", authRouter);
app.use("/places", authMiddleware, placesRouter);
app.use("/support", authMiddleware, supportRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  connectDb();
});
