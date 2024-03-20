import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Updateexpenses() {
  const [expense, setExpense] = useState({
    number: "",
    description: "",
    cost: "",
    category: "",
    date: new Date(),
  });

  const [preLoaded, setPreLoaded] = useState({
    number: "",
    description: "",
    cost: "",
    category: "",
    date: new Date(),
  });

  const navigate = useNavigate();
  const location = useLocation();

  const expenseno = parseInt(
    location.pathname.split("/")[2].replace(":", ""),
    10
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/expenses/${expenseno}`
        );
        const expenseData = res.data[0];
        expenseData.date = new Date(expenseData.date);
        setPreLoaded(expenseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [expenseno]);

  useEffect(() => {
    setExpense(preLoaded);
  }, [preLoaded]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputValueInCaps = inputValue.toUpperCase();
    setExpense((prev) => ({
      ...prev,
      [e.target.name]: inputValueInCaps,
    }));
    console.log(expense);
  };

  const handleDateChange = (date) => {
    setExpense((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/expenses/${expenseno}`, expense);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const back = () => {
    navigate("/");
  };
  return (
    <div>
      <h1>Update Expenses</h1>
      <button className="backbtn" onClick={back}>
        Go back
      </button>
      <form className="form">
        <div style={{ textAlign: "center" }}>
          <span
            style={{ fontSize: "35px", color: "purple", fontStyle: "italic" }}
          >
            Easy
          </span>
          <span style={{ fontSize: "35px", color: "red", fontWeight: "bold" }}>
            Manager
          </span>
          <h3>Expenses Update</h3>
        </div>
        <hr />
        <br />
        Expense Number:
        <input
          type="text"
          value={expense.number}
          onChange={handleChange}
          name="number"
        />
        <br />
        Description:
        <input
          type="text"
          value={expense.description}
          onChange={handleChange}
          name="description"
        />
        Cost:
        <input
          type="text"
          value={expense.cost}
          onChange={handleChange}
          name="cost"
        />
        Category:
        <select
          style={{ width: "656px" }}
          name="category"
          onChange={handleChange}
        >
          <option value="" disabled>
            Select
          </option>
          <option>Insurance</option>
          <option>Legal/Professional Fees</option>
          <option>Salaries</option>
          <option>Repairs & Maintenance</option>
          <option>Utilities</option>
          <option>Marketing Expenses</option>
          <option>Loan Payment</option>
          <option>Meal Expenses</option>
          <option>Tax Payable</option>
          <option>Bank Charges/Fees</option>
          <option>Miscellaneous</option>
        </select>
        <br />
        <br />
        Date:
        <DatePicker
          selected={expense.date}
          onChange={handleDateChange}
          dateFormat="EEEE, dd-MM-yyyy"
        />
        <br />
        <hr />
        <br />
        <button className="addbtn" onClick={handleSubmit}>
          Submit
        </button>
        <button className="backbtn" onClick={back}>
          Back
        </button>
      </form>
    </div>
  );
}

export default Updateexpenses;
