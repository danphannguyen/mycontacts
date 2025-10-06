import "./LoginPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const {
        jwtToken,
        data: { user },
      } = await login(email, password);
      loginUser(user, jwtToken);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // ===== Register =====
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await register(email, password);
      navigate("/login");

      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setIsLogin(true);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="wrapper">
      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label for="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="jean@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label for="password">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="W4uLsBc4Ltvl6T"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="button button-cta" type="submit">
            Login
          </button>
          <span
            className="button button-secondary"
            type="button"
            onClick={() => setIsLogin(false)}
          >
            Register
          </span>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div className="input-wrapper">
            <label for="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="jean@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label for="password">Mot de passe</label>
            <input
              name="password"
              type="password"
              placeholder="W4uLsBc4Ltvl6T"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label for="confirmPassword">Confirmer votre mot de passe</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="button button-cta" type="submit">
            Register
          </button>
          <span
            className="button button-secondary"
            type="button"
            onClick={() => setIsLogin(true)}
          >
            Login
          </span>
        </form>
      )}
    </div>
  );
}
