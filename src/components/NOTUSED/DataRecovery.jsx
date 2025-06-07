import { useEffect, useState } from "react";

const DataRecovery = () => {
  const backendURL = "/data/sampleJSON.json";

  const [data, setData] = useState(null);
  
    useEffect(() => {
      fetch(backendURL)
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error(err));
    }, []);
  
    if (!data) return <p>Cargando...</p>;

  return data; 
};

export default DataRecovery;
