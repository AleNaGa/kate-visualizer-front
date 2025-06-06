const PodView = ({ pod }) => (
  <div style={{ marginLeft: "20px", borderLeft: "2px solid #aaa", paddingLeft: "10px" }}>
    <h4>📦 Pod: {pod.name} ({pod.status})</h4>
    <p>Namespace: {pod.namespace} | Inicio: {new Date(pod.startTime).toLocaleString()}</p>

    <h5>Containers:</h5>
    <ul>
      {pod.containers.map((c, idx) => (
        <li key={idx}>
          {c.name} - {c.image} - {c.ready ? "✅ Ready" : "❌ Not Ready"}
        </li>
      ))}
    </ul>

    <p>Deployment: {pod.deployment}</p>
    {pod.services.length > 0 && (
      <p>Services: {pod.services.join(", ")}</p>
    )}
  </div>
);

export default PodView;
