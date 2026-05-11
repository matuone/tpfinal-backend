import { Place } from "../models/Places.js";

// const getPlacesAdmin = async (req, res) => {
//   const places = await Place.find({}); // Sin filtro, obtenemos todos los lugares
//   res.json(places);
// }

const getPlaces = async (req, res) => {
  const user = req.user; // Obtenemos el usuario autenticado

  const places = await Place.find({ userId: user.id }); // Filtramos por userId
  res.json(places);
}

const getPlace = async (req, res) => {
  const id = req.params.id; // Obtenemos el ID del lugar desde los parámetros de la ruta
  const user = req.user;
  const place = await Place.findOne({ _id: id, userId: user.id });
  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
}

const addPlace = async (req, res) => {
  const { name, lat, lng } = req.body;
  const user = req.user; // Obtenemos el usuario autenticado
  if (!name || !lat || !lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newPlace = new Place({
    name,
    userId: user.id, // Asignamos el userId del usuario autenticado
    lat,
    lng,
    date: new Date().toISOString(),
  });
  await newPlace.save();
  res.status(201).json(newPlace);
}

const updatePlace = async (req, res) => {
  const body = req.body
  const user = req.user; // Obtenemos el usuario autenticado
  const id = req.params.id; // Obtenemos el ID del lugar a actualizar desde los parámetros de la ruta
  const place = await Place.findOneAndUpdate(
    { userId: user.id, _id: id }, // Aseguramos que solo se actualice un lugar del usuario autenticado
    body,
    { new: true }
  );
  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
}

const deletePlace = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const place = await Place.findOneAndDelete({ _id: id, userId: user.id }); // Aseguramos que solo se borre el lugar solicitado del usuario autenticado
  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
}

export { getPlaces, getPlace, addPlace, deletePlace, updatePlace };
