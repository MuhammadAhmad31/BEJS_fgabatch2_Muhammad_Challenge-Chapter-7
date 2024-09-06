import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
