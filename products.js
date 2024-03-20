import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Productstable from "./pages/productstable";
import Add from "./pages/add";
import Update from "./pages/update";

const Products = () => {
  return (
    <div id = "main">
      <h1 style={{ textAlign: "center" }}>Inventory</h1>
      <hr />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Productstable />}></Route>
          <Route path="/add" element={<Add />}></Route>
          <Route path="/update/:number" element={<Update />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Products;
