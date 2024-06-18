import ItemPage from "./pages/Item/index.jsx";
import Home from "./pages/Home/index.jsx";
import ProductForm from "./pages/Form/index.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/new_product" element={<ProductForm />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
