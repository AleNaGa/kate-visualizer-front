async function fetchClusterState(sessionId) {
  try {
    const response = await fetch("http://localhost:8080/api/cluster/state", {
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
