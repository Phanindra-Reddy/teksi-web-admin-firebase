import { useEffect } from "react";
import "./App.css";
import MainLayout from "./Layout/MainLayout";
import { messaging, setupNotifications } from "../firebase";
import { onMessage } from "firebase/messaging";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./auth/RequireAuth";
import Bookings from "./features/Bookings";
import Login from "./auth/Login";
import Cancellations from "./features/Cancellations";
import Revenue from "./features/Revenue/Revenue";
import Users from "./features/Users/Users";
import Feedback from "./features/Feedback/Feedback";
import Drivers from "./features/Drivers";
import Vehicles from "./features/Vehicles";

function App() {
  useEffect(() => {
    setupNotifications();
    // Handle incoming messages
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // Customize notification here
      new Notification(payload.notification.title, {
        body: payload.notification.body,
      });
    });
  }, []);
  return (
    <>
      <MainLayout />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<RequireAuth Component={<Bookings />} />} />
        <Route
          path="/cancellations"
          element={<RequireAuth Component={<Cancellations />} />}
        />
        <Route
          path="/drivers"
          element={<RequireAuth Component={<Drivers />} />}
        />
        <Route
          path="/vehicles"
          element={<RequireAuth Component={<Vehicles />} />}
        />
        <Route
          path="/revenue"
          element={<RequireAuth Component={<Revenue />} />}
        />
        <Route path="/users" element={<RequireAuth Component={<Users />} />} />
        <Route
          path="/feedback"
          element={<RequireAuth Component={<Feedback />} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
