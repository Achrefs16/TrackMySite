import SignIn from "./components/landing/SginIn/SignIn";

import Home from "./components/landing/home/Home";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import SginUp from "./components/landing/SginUp/SginUp";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./store/ProtectedRoute";
import Start from "./components/Dashboard/com/Overview/Start";
import Instructions from "./components/Dashboard/com/Instructions";
import "react-tooltip/dist/react-tooltip.css";
import Visitors from "./components/Dashboard/com/Audience/Visitors";
function App() {
  axios.defaults.baseURL = "http://localhost:5173";
  return (
    <BrowserRouter>
      <div>
        {" "}
        <Toaster
          position="bottom-right"
          toastOption={{ duration: 3000 }}
        ></Toaster>
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
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              path="overview"
              element={<Start />}
            />{" "}
            <Route
              path="documentation"
              element={<Instructions />}
            />
            <Route
              path="events"
              element={<Instructions />}
            />
            <Route
              path="settings"
              element={<Instructions />}
            />
            <Route
              path="acquisition"
              element={<Instructions />}
            />
            <Route
              path="visitors"
              element={<Visitors />}
            />
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
