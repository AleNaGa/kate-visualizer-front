import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ClusterPage from "./pages/ClusterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cluster" element={<ClusterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
