const API_URL = import.meta.env.VITE_API_URL;

/**
 * Provee funciones para escalar y apagar deployments, interactuando con la API.
 *
 * Este Hook se encarga de proporcionar funciones de la API.
 * Primeromente, se verifica si hay una sesión activa en el almacenamiento local.
 * Y después se definen las funciones `scaleDownDeployment` y `scaleUpDeployment` que interactúan con la API para escalar y apagar deployments.
 *
 * @returns {Object} Un objeto con las siguientes funciones:
 *   - scaleDownDeployment: Escala un deployment a 0 replicas.
 *   - scaleUpDeployment: Escala un deployment a un número específico de replicas.
 */

export function useDeploymentActions() {
  const sessionId = localStorage.getItem("sessionId");

/**
 * Escala el deployment especificado a 0 replicas, deteniéndolo efectivamente.
 *
 * @param {string} namespace - El namespace del deployment.
 * @param {string} deploymentName - El nombre del deployment.
 * @returns {Promise<Object>} Un objeto que indica si la operación fue exitosa,
 *                            con una propiedad `success` que es true o false,
 *                            y una propiedad `data` o `error` con el resultado o mensaje de error.
 */

  const scaleDownDeployment = async (namespace, deploymentName) => {
    console.log("Apagando deployment:", namespace, deploymentName);
    // Verificar si hay una sesión activa
    if (!sessionId) {
      console.error("No hay session ID");
      return;
    }

    try {
      // Llamar a la API para apagar el deployment
      const response = await fetch(`${API_URL}/api/pod/scale-down`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
        // Enviar el namespace y el nombre del deployment en el cuerpo
        body: JSON.stringify({
          namespace,
          deploymentName,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Error al apagar el deployment:", error);
        return { success: false, error };
      }

      const result = await response.text();
      console.log("Deployment detenido:", result);
      return { success: true, data: result };
    } catch (err) {
      console.error("Error al escalar deployment:", err);
      return { success: false, error: err.message };
    }

    
  };
  /**
   * Escala el deployment especificado a un número específico de replicas.
   *
   * @param {string} namespace - El namespace del deployment.
   * @param {string} deploymentName - El nombre del deployment.
   * @param {number} replicas - El número de replicas que se desean.
   * @returns {Promise<Object>} Un objeto que indica si la operación fue exitosa,
   *                            con una propiedad `success` que es true o false,
   *                            y una propiedad `data` o `error` con el resultado o mensaje de error.
   */
    const scaleUpDeployment = async (namespace, deploymentName, replicas) => {
        console.log("Escalando deployment:", namespace, deploymentName, replicas);
        if (!sessionId) {
          console.error("No hay session ID");
          return { success: false, error: "No hay session ID" };
        }

        try {
          const response = await fetch(`${API_URL}/api/pod/scale-up`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Session-Id": sessionId,
            },
            body: JSON.stringify({ namespace, deploymentName, replicas }),
          });

          if (!response.ok) {
            const error = await response.text();
            console.error("Error al escalar el deployment:", error, response);
            return { success: false, error };
          }

          const result = await response.text();
          console.log("Deployment escalado:", result);
          return { success: true, data: result };
        } catch (err) {
          console.error("Error al escalar deployment:", err);
          return { success: false, error: err.message };
        }
      };
  return {
    scaleDownDeployment,
    scaleUpDeployment
  };

   

}
