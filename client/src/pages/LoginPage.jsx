import "./LoginPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
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
  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    if (storedUsers[email]) {
      alert("Nom d’utilisateur déjà utilisé");
      return;
    }

    storedUsers[email] = password;
    localStorage.setItem("users", JSON.stringify(storedUsers));
    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    setIsLogin(true);
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
          <button className="button-cta" type="submit">
            Login
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="button-cta" type="submit">
            Register
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}
