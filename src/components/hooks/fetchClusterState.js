const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hace una solicitud GET a la API para obtener el estado del cluster, validando la sesión.
 *
 * @param {string} sessionId - La ID de sesión para la autenticación.
 *
 * @returns {Promise<object>} Un objeto con la información del cluster, si la solicitud es exitosa.
 *
 * @throws {Error} Si la solicitud falla.
 */
async function fetchClusterState(sessionId) {
  try {
    const response = await fetch(`${API_URL}/api/cluster/state`, {
      method: "GET",
      headers: {
        "X-Session-Id": sessionId,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el estado del cluster.");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error en fetchClusterState:", err);
    throw err;
  }
}

export default fetchClusterState;
