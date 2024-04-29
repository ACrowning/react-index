import ItemPage from "./pages/Item/index.jsx";
import Home from "./pages/Home/index.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
