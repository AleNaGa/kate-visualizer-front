import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchLogin from "../components/hooks/fetchLogin";
import BubblesBackground from "../components/BubblesBackground";

function LoginPage() {
  const [apiUrl, setApiUrl] = useState("");
  const [token, setToken] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = fetchLogin(apiUrl, token);
      const sessionId = await response;
      localStorage.setItem("sessionId", sessionId);
      navigate("/cluster");
    } catch (err) {
      setToastMessage("Error al iniciar sesión: " + err.message);
    }
  };
  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center font-audiowide text-[15px]">
      <BubblesBackground />
      
        
      <div className=" flex items-center  p-5  justify-center bg-[url('/formBG3.png')] bg-no-repeat bg-contain z-10 relative ">

        <div className="flex flex-col items-center p-20 py-20 margin-auto ">
          <h2 className="text-3xl font-bold text-slate-100 mb-10 text-center drop-shadow-xl tracking-wider">
            K.A.T.E.
          </h2>

          <input
            className="
              w-60 mb-5 px-5 py-3 rounded-full
              border-2 bg-white/90 text-lime-700
              placeholder-gray-600 placeholder-opacity-80
              shadow-inner
              transition-all duration-500 ease-in-out
              focus:outline-none focus:border-transparent focus:bg-white
              focus:[border-image:linear-gradient(to_right,transparent,#66ffff,transparent)_1]
            "
            placeholder="Kubernetes Server URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />

          <input
            className="
              w-60 mb-8 px-5 py-3 rounded-full
              border-2 bg-white/90 text-lime-700
              placeholder-gray-600 placeholder-opacity-80
              shadow-inner
              transition-all duration-500 ease-in-out
              focus:outline-none focus:border-transparent focus:bg-white
              focus:[border-image:linear-gradient(to_right,transparent,#66ffff,transparent)_1]
            "
            placeholder="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <button
            className="
              w-40 bg-[url('/textures/buttons/green.png')] bg-contain bg-no-repeat bg-center h-20
              flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all ease-in-out duration-300"
            onClick={handleLogin}
          >
             <span className="relative z-10 text-gray-800">Login</span>
          </button>
        </div>
      </div>

    <div className="absolute  bg-[url('/Footer.png')] bg-contain bg-no-repeat bg-left bottom-0 left-0 w-full h-1/6 z-10">



    </div>
      {toastMessage && (
        <div
          className="
            fixed bottom-6 right-6
            bg-gradient-to-b from-gray-100 via-slate-100 to-gray-500 
          text-gray-900 px-4 py-2 rounded-xl shadow-md
            z-[1100]
            border border-white/20
            max-w-xs
            text-sm
            transition-opacity duration-300
          "
        >
          {toastMessage}
        </div>
      )}

    </div>
    
  );
}

export default LoginPage;
