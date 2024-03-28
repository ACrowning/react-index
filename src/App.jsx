import ProductPage from "./components/itemPage.jsx";
import Home from "./components/home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ProductPage />} />
          <Route path="/sorting/:elements" element={<queryParam />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
