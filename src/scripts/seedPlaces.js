process.loadEnvFile();

const API_URL = process.env.SEED_API_URL || "http://localhost:3000";
const email = process.env.SEED_USER_EMAIL || "demo.ruteando@example.com";
const password = process.env.SEED_USER_PASSWORD || "Ruteando123!";

const samplePlaces = [
  { name: "Cafe del Centro", lat: -34.6037, lng: -58.3816 },
  { name: "Plaza de Barrio", lat: -34.6158, lng: -58.4333 },
  { name: "Biblioteca Norte", lat: -34.5681, lng: -58.4445 },
];

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
};

const getToken = async () => {
  try {
    const loginData = await requestJson(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return loginData.token;
  } catch {
    const registerData = await requestJson(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return registerData.token;
  }
};

const main = async () => {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const existingPlaces = await requestJson(`${API_URL}/places`, { headers });
  const existingNames = new Set(existingPlaces.map((place) => place.name));

  let createdCount = 0;

  for (const place of samplePlaces) {
    if (existingNames.has(place.name)) {
      continue;
    }

    await requestJson(`${API_URL}/places`, {
      method: "POST",
      headers,
      body: JSON.stringify(place),
    });

    createdCount += 1;
  }

  const placesAfter = await requestJson(`${API_URL}/places`, { headers });

  console.log(
    JSON.stringify(
      {
        email,
        createdCount,
        totalPlaces: placesAfter.length,
        placeNames: placesAfter.map((place) => place.name),
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});