import { useEffect, useState } from "react";
//PRUEBA DE HOOK DE DATOS con MOCK
export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/sampleJSON.json")
      .then(res => res.json())
      .then(data => {
      console.log("Data cargada:", data.nodes);
      setData(data);
      })
      .catch(err => console.error(err));
  }, []);

  return data;
};