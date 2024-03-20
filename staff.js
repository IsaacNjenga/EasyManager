import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import StaffTable from "./pages/stafftable";
import StaffAdd from "./pages/staffadd";
import StaffUpdate from "./pages/staffupdate";

const staff = () => {
  return (
    <div id = "main">
      <h1 style={{ textAlign: "center" }}>Salespersons</h1>
      <hr />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StaffTable />}></Route>
          <Route path="/add" element={<StaffAdd />}></Route>
          <Route path="/update/:number" element={<StaffUpdate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default staff;
