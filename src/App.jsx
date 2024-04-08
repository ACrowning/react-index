import ItemPage from "./components/itemPage.jsx";
import Home from "./components/home.jsx";
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
