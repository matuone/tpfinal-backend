import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  date: { type: String, required: true }
}, {
  versionKey: false
});

export const Place = mongoose.model("Place", placeSchema);