import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["bug", "mejora", "consulta"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "media",
    },
    status: {
      type: String,
      enum: ["abierto", "en_progreso", "resuelto"],
      default: "abierto",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);