import SignIn from "./components/landing/SginIn/SignIn";

import Home from "./components/landing/home/Home";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import SginUp from "./components/landing/SginUp/SginUp";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./store/ProtectedRoute";
import Start from "./components/Dashboard/com/Overview/Start";
import Instructions from "./components/Dashboard/com/Docs/Instructions";
import "react-tooltip/dist/react-tooltip.css";
import Visitors from "./components/Dashboard/com/Audience/Visitors";
import Demographic from "./components/Dashboard/com/Audience/Demographic";
import UserEngagement from "./components/Dashboard/com/Audience/UserEngagement";
import Devices from "./components/Dashboard/com/Audience/Devices";
import Language from "./components/Dashboard/com/Audience/Language";
import Behaivor from "./components/Dashboard/com/Behaivor/Behaivor";
import Pages from "./components/Dashboard/com/Behaivor/Pages";
import Journeys from "./components/Dashboard/com/Behaivor/Journeys";
import Interaction from "./components/Dashboard/com/Behaivor/Interaction";
import Session from "./components/Dashboard/com/Behaivor/Session";
import Acquisition from "./components/Dashboard/com/Behaivor/Acquisition";
import Conversion from "./components/Dashboard/com/Conversion/Conversion";
import Ecommerce from "./components/Dashboard/com/Conversion/Ecommerce";
import InteractionE from "./components/Dashboard/com/Conversion/InteractionE";
import Subscription from "./components/Dashboard/com/Conversion/Subscription";
import Segmentation from "./components/Dashboard/com/Conversion/Segmentation";
import Docs from "./components/Dashboard/com/Docs/Docs";
import Homee from "./components/Dashboard/com/Home/Home";
import AdvancedTracking from "./components/Dashboard/com/Docs/AdvancedTracking";
import EventsTracking from "./components/Dashboard/com/Docs/EventsTracking";
import WebsiteDetail from "./components/Dashboard/com/Home/WebsiteDetail";
import Settings from "./components/Dashboard/com/Settings/Settings";
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
              path="home"
              element={<Homee />}
            ></Route>
            <Route
              path="website/:id"
              element={<WebsiteDetail />}
            />
            <Route
              path="conversion"
              element={<Conversion />}
            >
              <Route
                path="purchase"
                element={<Ecommerce />}
              ></Route>
              <Route
                path="interaction"
                element={<InteractionE />}
              ></Route>
              <Route
                path="subscription"
                element={<Subscription />}
              ></Route>
              <Route
                path="segmentation"
                element={<Segmentation />}
              ></Route>
            </Route>
            <Route
              path="overview"
              element={<Start />}
            />{" "}
            <Route
              path="documentation"
              element={<Docs />}
            >
              {" "}
              <Route
                path="installation"
                element={<Instructions />}
              />
              <Route
                path="tracking"
                element={<AdvancedTracking />}
              />
              <Route
                path="events"
                element={<EventsTracking />}
              />
            </Route>
            <Route
              path="behaivor"
              element={<Behaivor />}
            >
              <Route
                path="interactions"
                element={<Interaction />}
              />{" "}
              <Route
                path="acquisition"
                element={<Acquisition />}
              />
              <Route
                path="journeys"
                element={<Journeys />}
              />{" "}
              <Route
                path="session"
                element={<Session />}
              />{" "}
              <Route
                path="pages"
                element={<Pages />}
              />
            </Route>
            <Route
              path="settings"
              element={<Settings />}
            />
            <Route
              path="visitors"
              element={<Visitors />}
            >
              <Route
                path="demographic"
                element={<Demographic />}
              ></Route>
              <Route
                path="engagement"
                element={<UserEngagement />}
              ></Route>
              <Route
                path="devices"
                element={<Devices />}
              ></Route>
              <Route
                path="language"
                element={<Language />}
              ></Route>
            </Route>
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
