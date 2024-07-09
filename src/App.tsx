import ItemPage from "./pages/Item";
import Home from "./pages/Home";
import ProductForm from "./pages/Form";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/new_product" element={<ProductForm />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
