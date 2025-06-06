async function fetchLogin(apiServerUrl, token) {
  try {
    const response = await fetch("http://localhost:8080/api/cluster/login", { // cambiar por un .env o algo
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

    const sessionId = await response.text(); // plain text response
    return sessionId;
  } catch (err) {
    console.error("Error en fetchLogin:", err, apiServerUrl, token);
    throw err;
  }
}

export default fetchLogin;