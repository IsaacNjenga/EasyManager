import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Exepensestable from "./pages/expensestable";
import Add from "./pages/addexpenses";
import Update from "./pages/updateexpenses";

const expenses = () => {
  return (
    <div id = "main">
      <h1 style={{ textAlign: "center" }}>Expenses</h1>
      <hr />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Exepensestable />}></Route>
          <Route path="/add" element={<Add />}></Route>
          <Route path="/update/:number" element={<Update />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default expenses;
