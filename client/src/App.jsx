import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

// Components import
import { Navbar } from "./components/Navbar";

// Pages import
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
// import ContactPage from '../pages/ContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body-wrapper">
        <Navbar />

        <main className="main-wrapper">
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              {/* <Route path="/contact" element={<ContactPage />} /> */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </main>
      </div>
    </BrowserRouter>
  );
}
