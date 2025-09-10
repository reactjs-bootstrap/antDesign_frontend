import React from "react";
import { Layout as AntLayout } from "antd";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const { Content, Footer } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ padding: "20px" }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Hospital System ©{new Date().getFullYear()}
      </Footer>
    </AntLayout>
  );
};

export default Layout;
