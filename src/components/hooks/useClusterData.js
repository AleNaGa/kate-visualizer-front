import { useEffect, useState } from "react";

export function useClusterData(pollInterval = 5000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchClusterState = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      try {
        const response = await fetch("http://localhost:8080/api/cluster/state", {
          headers: {
            "X-Session-Id": sessionId,
          },
        });

        if (!response.ok) {
          console.error("Fallo al obtener datos del cluster");
          return;
        }

        const json = await response.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        console.error("Error en fetchClusterState:", err);
      }
    };

    fetchClusterState(); // Primera llamada inmediata
    const interval = setInterval(fetchClusterState, pollInterval); // Repetición

    return () => {
      isMounted = false;
      clearInterval(interval); // Limpieza al desmontar
    };
  }, [pollInterval]);

  return data;
}
