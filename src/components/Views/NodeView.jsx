import PodView from "./PodView";

const NodeView = ({ node }) => (
  <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
    <h2>🖥️ Node: {node.name}</h2>
    <p>Status: {node.status} | IP: {node.ip} | CPU: {node.cpu} | Memoria: {node.memory}</p>

    <h3>Pods:</h3>
    {node.pods.map((pod, idx) => (
      <PodView key={idx} pod={pod} />
    ))}
  </div>
);

export default NodeView;
