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
import AddDriver from "./features/AddDriver";
import AddVehicle from "./features/AddVehicle";
import Cancellations from "./features/Cancellations";

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
          path="/add-driver"
          element={<RequireAuth Component={<AddDriver />} />}
        />
        <Route
          path="/add-vehicle"
          element={<RequireAuth Component={<AddVehicle />} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
