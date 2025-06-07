const API_URL = import.meta.env.VITE_API_URL;
/**
 * Intenta loguear en el cluster de Kubernetes a trav es de la API.
 * @param {string} apiServerUrl URL del servidor de la API de Kubernetes
 * @param {string} token Token de autenticación
 * @returns {Promise<string>} La ID generada
 * @throws {Error} Si falla el login
 */
async function fetchLogin(apiServerUrl, token) {
  try {
    const response = await fetch(`${API_URL}/api/cluster/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ apiServerUrl, token }),
    });
    console.log("accediendo...");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Login fallido: " + errorText);
    }

    const sessionId = await response.text(); // plain text response porque la API no devuelve JSON
    return sessionId;
  } catch (err) {
    console.error("Error en fetchLogin:", err, apiServerUrl, token);
    throw err;
  }
}

export default fetchLogin;