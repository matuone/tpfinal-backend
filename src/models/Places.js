import mongoose from "mongoose";

// Categorías disponibles para los lugares
const CATEGORIES = ["CASA", "Restaurante", "Parque", "Museo", "Tienda", "Playa", "Montaña", "Otro"];

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  category: {
    type: String,
    enum: CATEGORIES,
    default: "Otro"
  },
  address: {
    type: String,
    default: "Ubicación desconocida"
  },
  date: { type: String, required: true }
}, {
  versionKey: false
});

export const Place = mongoose.model("Place", placeSchema);
export { CATEGORIES };