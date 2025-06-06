export function useDeploymentActions() {
  const sessionId = localStorage.getItem("sessionId");

  const scaleDownDeployment = async (namespace, deploymentName) => {
    console.log("Apagando deployment:", namespace, deploymentName);
    if (!sessionId) {
      console.error("No hay session ID");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/pod/scale-down", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": sessionId,
        },
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
    const scaleUpDeployment = async (namespace, deploymentName, replicas) => {
        console.log("Escalando deployment:", namespace, deploymentName, replicas);
        if (!sessionId) {
          console.error("No hay session ID");
          return { success: false, error: "No hay session ID" };
        }

        try {
          const response = await fetch("http://localhost:8080/api/pod/scale-up", {
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
