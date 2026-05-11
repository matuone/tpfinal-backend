import { Place, CATEGORIES } from "../models/Places.js";

// Función auxiliar para obtener dirección desde coordenadas (Geocodificación inversa)
const getReverseGeocoding = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.address?.road || data.address?.city || data.display_name || "Ubicación desconocida";
  } catch (error) {
    console.error("Error en geocodificación inversa:", error);
    return "Ubicación desconocida";
  }
};

// Obtener categorías disponibles
const getCategories = async (req, res) => {
  res.json({ categories: CATEGORIES });
};

// Obtener lugares con filtrado avanzado
const getPlaces = async (req, res) => {
  const user = req.user;
  const { name, category, startDate, endDate, lat, lng, radius } = req.query;

  let query = { userId: user.id };

  // Filtro por nombre (búsqueda)
  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  // Filtro por categoría
  if (category && CATEGORIES.includes(category)) {
    query.category = category;
  }

  // Filtro por rango de fechas
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate).toISOString();
    if (endDate) query.date.$lte = new Date(endDate).toISOString();
  }

  let places = await Place.find(query);

  // Filtro por proximidad (radio en km)
  if (lat && lng && radius) {
    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    const radiusInDegrees = radiusKm / 111; // Aproximación: 1 grado ≈ 111 km

    places = places.filter(place => {
      const distance = Math.sqrt(
        Math.pow(place.lat - centerLat, 2) + Math.pow(place.lng - centerLng, 2)
      );
      return distance <= radiusInDegrees;
    });
  }

  res.json(places);
};

const getPlace = async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const place = await Place.findOne({ _id: id, userId: user.id });
  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
};

const addPlace = async (req, res) => {
  const { name, lat, lng, category } = req.body;
  const user = req.user;

  if (!name || !lat || !lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Obtener dirección desde coordenadas
  const address = await getReverseGeocoding(lat, lng);

  const newPlace = new Place({
    name,
    userId: user.id,
    lat,
    lng,
    category: category || "Otro",
    address,
    date: new Date().toISOString(),
  });

  await newPlace.save();
  res.status(201).json(newPlace);
};

const updatePlace = async (req, res) => {
  const body = req.body;
  const user = req.user;
  const id = req.params.id;

  // Si cambián las coordenadas, obtener nueva dirección
  if (body.lat && body.lng) {
    body.address = await getReverseGeocoding(body.lat, body.lng);
  }

  const place = await Place.findOneAndUpdate(
    { userId: user.id, _id: id },
    body,
    { new: true }
  );

  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
};

const deletePlace = async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const place = await Place.findOneAndDelete({ _id: id, userId: user.id });
  if (!place) return res.status(404).json({ error: "Place not found" });
  res.json(place);
};

export { getPlaces, getPlace, addPlace, deletePlace, updatePlace, getCategories };
