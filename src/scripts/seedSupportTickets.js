process.loadEnvFile();

const API_URL = process.env.SEED_API_URL || "http://localhost:3000";
const email = process.env.SEED_USER_EMAIL || "demo.ruteando@example.com";
const password = process.env.SEED_USER_PASSWORD || "Ruteando123!";

const sampleTickets = [
  {
    title: "No se guarda un lugar cuando rechazo geolocalización",
    description: "Al negar permisos de ubicación, la app informa el error pero el usuario no recibe una alternativa clara para registrar el lugar manualmente.",
    type: "bug",
    priority: "alta",
    status: "abierto",
  },
  {
    title: "Agregar etiquetas a los lugares favoritos",
    description: "Se necesita clasificar lugares por categorías como café, plaza o trabajo para mejorar la búsqueda futura.",
    type: "mejora",
    priority: "media",
    status: "en_progreso",
  },
  {
    title: "Consulta sobre expiración de sesión",
    description: "Un usuario pregunta cada cuánto tiempo vence el token y qué pasa si vuelve a abrir la app al día siguiente.",
    type: "consulta",
    priority: "baja",
    status: "resuelto",
  },
  {
    title: "El mapa no centra el último lugar registrado",
    description: "Después de guardar un nuevo punto, el mapa permanece en la vista inicial y dificulta validar visualmente el alta.",
    type: "bug",
    priority: "media",
    status: "abierto",
  },
  {
    title: "Métrica de errores de autenticación en dashboard",
    description: "Producto solicita exponer una métrica simple de fallos de login para evaluar fricción de acceso en post-lanzamiento.",
    type: "mejora",
    priority: "alta",
    status: "en_progreso",
  },
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
  } catch (error) {
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

  const existingTickets = await requestJson(`${API_URL}/support/tickets`, { headers });
  const existingTitles = new Set(existingTickets.map((ticket) => ticket.title));

  let createdCount = 0;

  for (const ticket of sampleTickets) {
    if (existingTitles.has(ticket.title)) {
      continue;
    }

    const created = await requestJson(`${API_URL}/support/tickets`, {
      method: "POST",
      headers,
      body: JSON.stringify(ticket),
    });

    if (created.status !== ticket.status) {
      await requestJson(`${API_URL}/support/tickets/${created._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: ticket.status, priority: ticket.priority }),
      });
    }

    createdCount += 1;
  }

  const metrics = await requestJson(`${API_URL}/support/metrics`, { headers });

  console.log(
    JSON.stringify(
      {
        email,
        createdCount,
        totalTickets: sampleTickets.length,
        metrics,
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