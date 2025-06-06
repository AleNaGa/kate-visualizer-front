import { useEffect, useState } from "react";
import NodeView from "./NodeView";

const KubeViewer = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/sampleJSON.json")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Arquitectura de Kubernetes</h1>
      {data.nodes.map((node, idx) => (
        <NodeView key={idx} node={node} />
      ))}
    </div>
  );
};

export default KubeViewer;
