import ItemPage from "./pages/Item";
import Home from "./pages/Home";
import ProductForm from "./pages/Form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactElement } from "react";

function App(): ReactElement {
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
