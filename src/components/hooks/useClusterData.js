import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
/**
 * Hook que devuelve el estado actual del cluster.
 *
 * @param {number} pollInterval Tiempo en milisegundos entre llamadas a la API
 *                              para obtener el estado del cluster.
 *
 * @returns {object|null} El estado del cluster, o null si no se ha podido
 *                       obtener (por ejemplo, si no se ha iniciado sesión).
 *
 * @example
 * const clusterData = useClusterData();
 * console.log(clusterData);
 * ¿Por qué es un hook? Porque se actualiza automáticamente.
 */
export function useClusterData(pollInterval = 5000) { // 5 segundos es el intervalo por de la poll
  const [data, setData] = useState(null);

  useEffect(() => {
    // Flag para saber si el componente está montado
    let isMounted = true;

    const fetchClusterState = async () => {
      // Verificar si tenemos sesión
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      try {
        const response = await fetch(`${API_URL}/api/cluster/state`, {
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
    const interval = setInterval(fetchClusterState, pollInterval); // Repetición para obtener el estado del cluster cada intervalo

    return () => {
      isMounted = false;
      clearInterval(interval); // Limpieza al desmontar
    };
  }, [pollInterval]);

  return data;
}
