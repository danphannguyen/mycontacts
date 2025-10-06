"use client";

import { NavLink } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="nav-wrapper">
      {navItems.map((item) => (
        <NavLink key={item.href} to={item.href} className="">
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
