import { useDeploymentActions } from "../components/hooks/useDeploymentActions";
import { useState} from "react";

export default function DeploymentsForm({ data }) {
  const [replicaChanges, setReplicaChanges] = useState({}); // Estado para los cambios de replicas
  const [toastMessage, setToastMessage] = useState(null); // Estado para el mensaje de toast
  const { scaleDownDeployment } = useDeploymentActions(); // Acceso a las acciones de apagado
  const { scaleUpDeployment } = useDeploymentActions(); // Acceso a las acciones de escalado

  /**
   * Actualiza el estado replicaChanges con el nuevo valor de replicas
   * para el deployment especificado por el nombre.
   *
   * @param {string} name - Nombre del deployment
   * @param {number} value - Nueva cantidad de replicas
   */
  const handleChangeReplicas = (name, value) => {
    setReplicaChanges((prev) => ({ ...prev, [name]: value }));
  };

/**
 * Muestra un toast con el mensaje especificado.
 *
 * @param {string} message - Mensaje a mostrar en el toast
 */

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000); // Desaparece a los 3 segundos
  };

  /**
   * Escala el deployment especificado un número de replicas.
   *
   * @param {string} namespace - Namespace del deployment
   * @param {string} deploymentName - Nombre del deployment
   * @param {number} replicas - Nueva cantidad de replicas
   */
  const handleScale = (namespace, deploymentName, replicas) => {
    const result = scaleUpDeployment(namespace, deploymentName, replicas);

    if (result.success) {
      // alert("Deployment escalado correctamente");
      showToast("Deployment escalado correctamente");
    } else {
      // alert("Error al escalar el deployment: " + result.error);
      showToast("Deployment escalado correctamente");
    }
  };

  /**
   * Detiene el deployment especificado.
   *
   * @param {string} deploymentName - Nombre del deployment
   * @param {string} namespace - Namespace del deployment
   */
  const handleStop = async (deploymentName, namespace) => {
    const result = await scaleDownDeployment(namespace, deploymentName);

    if (result.success) {
      // alert("Deployment detenido correctamente");
      showToast("Deployment detenido correctamente");
    } else {
      // alert("Error al detener el deployment: " + result.error);
      showToast("Error al detener el deployment: " + result.error);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[1000]">
        <div className="relative text-center space-y-4 p-6 text-white flex flex-col w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold flex items-center justify-center">
            Gestión de Deployments
          </h2>

          {data?.deployments?.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 ">
              {data.deployments.map((deployment) => (
                <div
                  key={deployment.name}
                  className="p-4 border border-white/10 rounded-xl shadow-sm flex flex-col gap-4 bg-gradient-to-b from-cyan-900 to-gray-400 "
                >
                  <div className="text-left space-y-1">
                    <h2 className="text-xl font-semibold">{deployment.name}</h2>
                    <p className="text-sm text-gray-100">
                      Namespace:{" "}
                      <span className="text-white font-medium">
                        {deployment.namespace}
                      </span>
                    </p>
                    <p className="text-sm text-slate-100">
                      Réplicas disponibles:{" "}
                      <span className="text-white font-medium">
                        {deployment.availableReplicas} / {deployment.replicas}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pr-20">
                    <input
                      type="number"
                      min="0"
                      placeholder="Nº de réplicas"
                      value={replicaChanges[deployment.name] ?? ""}
                      onChange={(e) =>
                        //Se actualizan los cambios de replicas
                        handleChangeReplicas(deployment.name, e.target.value)
                      }
                      className="w-60  px-5 py-3 rounded-full
                        border-2 bg-white/90 text-lime-700
                         border-gray-400
                        placeholder-gray-600 placeholder-opacity-80
                        shadow-inner
                        transition-all duration-500 ease-in-out
                        focus:outline-none focus:border-transparent focus:bg-white
                        focus:[border-image:linear-gradient(to_right,transparent,#66ffff,transparent)_1]"
                    />

                    <button
                      onClick={() =>
                        //Se escala el deployment
                        handleScale(
                          deployment.namespace,
                          deployment.name,
                          parseInt(replicaChanges[deployment.name]) || 0
                        )
                      }
                      className="w-40 bg-[url('/textures/buttons/grey.png')] bg-contain bg-no-repeat bg-center h-20
              flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all ease-in-out duration-300"
                    >
                      <span className="text-black">Aplicar</span>
                    </button>
                    <button
                      onClick={() => 
                        //Se detiene el deployment
                        handleStop(deployment.name, deployment.namespace)}
                      className="w-40 bg-[url('/textures/buttons/red.png')] bg-contain bg-no-repeat bg-center h-20
              flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all ease-in-out duration-300"
                    >
                      <span>Apagar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay deployments disponibles.</p>
          )}
        </div>
      </div>

      {/* Notificacion */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2
          bg-gradient-to-b from-gray-100 via-slate-100 to-gray-500 
          text-gray-900 px-8 py-3 rounded-3xl shadow-lg
          z-[1100]
          transition-opacity duration-300
          border">
          {toastMessage}
        </div>
      )}
    </>
  );
}
