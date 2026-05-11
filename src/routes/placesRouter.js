import { Router } from "express";
import { getPlaces, addPlace, getPlace, updatePlace, deletePlace } from "../controllers/placesController.js";
import { Place } from "../models/Places.js";

const router = Router();

// Aquí irán las rutas relacionadas con "places"

// GET: listar todos
router.get("/", getPlaces);

// GET: obtener uno por id
router.get("/:id", getPlace);

// POST: crear nuevo
router.post("/", addPlace);

// PATCH: actualizar por id
router.patch("/:id", updatePlace);

// DELETE: eliminar por id
router.delete("/:id", deletePlace);

// Ruta por defecto (404)
router.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export { router };