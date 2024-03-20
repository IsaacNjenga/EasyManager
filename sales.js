import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SalesTable from "./pages/salestable";
import AddSale from "./pages/addsale";
import UpdateSale from "./pages/updatesale";

const Sales = () => {
  return (
    <div id="main">
      <h1 style={{ textAlign: "center" }}> Sales </h1>
      <hr />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SalesTable />}></Route>
          <Route path="/add" element={<AddSale />}></Route>
          <Route path="/update/:number" element={<UpdateSale />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Sales;
