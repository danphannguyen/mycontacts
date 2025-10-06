import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { logoutUser } = useAuth();

  const navItems = [
    { label: "Home", href: "/" },
  ];


  return (
    <nav className="nav-wrapper">
      {navItems.map((item) => (
        <NavLink key={item.href} to={item.href}>
          {item.label}
        </NavLink>
      ))}

      <button className="logout-button" onClick={logoutUser}>
        Logout
      </button>
    </nav>
  );
}
