import React from "react";
import { CheckCircle, XCircle, Info, Clock } from "lucide-react";


function PodCard({ pod }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (pod) {
      setVisible(true);
    }
  }, [pod])
  if (!pod) return null;

  return (
           <div
        className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-full max-w-md p-6 text-white drop-shadow-2xl
            transition-opacity duration-1000 ease-in-out
            pointer-events-auto
            ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        >
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold flex items-center justify-center gap-2">
            <Info className="w-6 h-6 text-sky-300" />
            {pod.name}
            </h2>

            <h3 className="text-lg text-gray-300 font-light">
            Namespace: <span className="font-medium text-white">{pod.namespace}</span>
            </h3>

            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Start Time: <span className="text-white">{pod.startTime}</span>
            </p>

            <p className="text-md font-medium">
            Status:{" "}
            <span
                className={`inline-flex items-center gap-1 ${
                pod.status === "Running" ? "text-green-400" : "text-red-400"
                }`}
            >
                {pod.status === "Running" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {pod.status}
            </span>
            </p>
            <br />
            <p className="text-md font-medium">Containers:</p>
            <ul className="mt-4 space-y-1 text-sm text-left mx-auto max-w-xs">
            {pod.containers.map((c, idx) => (
                <li key={idx} className="flex items-center justify-between border-b border-white/10 pb-1">
                <div className="flex flex-col">
                    <span className="font-semibold">{c.name}</span>
                    <span className="text-xs text-gray-400">{c.image}</span>
                </div>
                <div className="text-right">
                    {c.ready ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                    )}
                </div>
                </li>
            ))}
            </ul>
        </div>
        </div>

  );
}

export default PodCard;
