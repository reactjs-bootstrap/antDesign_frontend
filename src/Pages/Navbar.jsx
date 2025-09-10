import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";

const { Header } = Layout;

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    setIsAuthenticated(false);
    navigate("/login"); // redirect to login
  };

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      {/* Logo / Title */}
      <div
        className="logo"
        style={{ color: "white", fontWeight: "bold", marginRight: "30px" }}
      >
        Hospital System
      </div>

      {/* Main Navigation */}
      <Menu theme="dark" mode="horizontal" style={{ flex: 1 }}>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.SubMenu key="patients" title="Patients">
          <Menu.Item key="patients-list">
            <Link to="/patients/list">List</Link>
          </Menu.Item>
          <Menu.Item key="patients-create">
            <Link to="/patients/create">Create</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>

      {/* Auth Links */}
      <div style={{ marginLeft: "auto" }}>
        {!isAuthenticated ? (
          <>
            <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        ) : (
          <span
            onClick={handleLogout}
            style={{ color: "white", cursor: "pointer" }}
          >
            Logout
          </span>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
