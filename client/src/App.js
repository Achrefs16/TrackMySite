import SignIn from "./components/landing/SginIn/SignIn";
import NavBar from "./components/landing/NavBar";
import Home from "./components/landing/home/Home";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import SginUp from "./components/SginUp/SginUp";
import Dashboard from "./components/Dashboard/Dashboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/sign-in"
            element={<SignIn />}
          />
          <Route
            path="/sign-up"
            element={<SginUp />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
