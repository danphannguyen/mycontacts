import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./utils/PrivateRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// Components import
import { Navbar } from "./components/Navbar";

// Pages import
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <div className="body-wrapper">
        {token && <Navbar />}

        <main className="main-wrapper">
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
