import { connect } from "mongoose";

// En producción (Render) no existe archivo .env físico;
// si no está, usamos las variables del entorno sin fallar.
try {
  process.loadEnvFile();
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

const connectDb = async () => {
  try {
    await connect(process.env.URI_DB)
    console.log("✅ Conectado a mongodb con éxito")
  } catch (error) {
    console.log("❌ Error al conectarse a mongodb")
  }
}

export { connectDb }