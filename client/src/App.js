import NavBar from "./components/landing/NavBar";
import Home from "./components/landing/home/Home";
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
