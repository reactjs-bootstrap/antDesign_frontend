import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./Pages/Components/Layout";

// Pages
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import RegistrationForm from "./Pages/Components/RegistrationForm";
import LoginForm from "./Pages/Components/LoginForm";
import ProtectedRoute from "./Pages/Components/ProtectedRoute";
import NotFound from "./Pages/NotFound"; // ✅ new

// Patients
import PatientList from "./Pages/Patients/PatientList";
import CreatePatient from "./Pages/Patients/CreatePatient";
import UpdatePatient from "./Pages/Patients/UpdatePatient";
import DeletePatient from "./Pages/Patients/DeletePatient";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* All main routes inside Layout */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Patients CRUD */}
          <Route
            path="/patients/list"
            element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/create"
            element={
              <ProtectedRoute>
                <CreatePatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/update/:mrn"
            element={
              <ProtectedRoute>
                <UpdatePatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/delete/:mrn"
            element={
              <ProtectedRoute>
                <DeletePatient />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public Routes */}
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
