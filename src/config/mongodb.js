import { connect } from "mongoose";
process.loadEnvFile()

const connectDb = async () => {
  try {
    await connect(process.env.URI_DB)
    console.log("✅ Conectado a mongodb con éxito")
  } catch (error) {
    console.log("❌ Error al conectarse a mongodb")
  }
}

export { connectDb }