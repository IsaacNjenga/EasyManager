import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function SalesTable() {
  const [sales, setSales] = useState([]);
  const [grid, setGrid] = useState(false);
  const [list, SetList] = useState(true);
  const [search, setSearch] = useState("");
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedSaleNumber, setSelectedSaleNumber] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function gridlayout() {
    setGrid(true);
    SetList(false);
    console.log(currentDateTime);
  }

  function listLayout() {
    SetList(true);
    setGrid(false);
  }

  useEffect(() => {
    const fetchAllSales = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/sales`);
        const sortedSales = res.data.sort(
          (a, b) => new Date(b.dateSold) - new Date(a.dateSold)
        );
        setSales(sortedSales);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllSales();
  }, []);

  const click = (saleNumber) => {
    setUserWantsToDelete(false);
    setSelectedSaleNumber(saleNumber);
  };

  const handleYesClick = async (number) => {
    try {
      await axios.delete(`http://localhost:8800/sales/${number}`);
      setSales((prevSales) =>
        prevSales.filter((sale) => sale.number !== number)
      );
      setUserWantsToDelete(true);
      setSelectedSaleNumber(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoClick = () => {
    setUserWantsToDelete(true);
    setSelectedSaleNumber(null);
  };

  const styles = {
    width: "160px",
    height: "150px",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "10px",
    transition: "all 0.4s ease-in",
    border: "1px inset #050101",
    boxShadow: "5px 5px 36px #a78e8e, -5px -5px 36px #e7c4c4",
  };

  const buttonStyle = {
    backgroundColor: grid ? "black" : "initial",
    color: grid ? "white" : "initial",
  };

  const buttonStyle2 = {
    backgroundColor: list ? "black" : "initial",
    color: list ? "white" : "initial",
  };

  const totalAmount = sales
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const groupedSalesByDate = sales.reduce((acc, sale) => {
    const date = format(new Date(sale.datesold), "yyyy-MM-dd");
    acc[date] = acc[date] || [];
    acc[date].push(sale);
    return acc;
  }, {});

  const totalAmountByDate = Object.keys(groupedSalesByDate).reduce(
    (acc, date) => {
      const totalForDate = groupedSalesByDate[date].reduce(
        (total, sale) => total + sale.total,
        0
      );
      acc[date] = totalForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const totalCommissionByDate = Object.keys(groupedSalesByDate).reduce(
    (acc, date) => {
      const totalCommissionForDate = groupedSalesByDate[date].reduce(
        (commission, sale) => commission + sale.commission,
        0
      );
      acc[date] = totalCommissionForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const groupedSalesByDateSorted = Object.keys(groupedSalesByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <form>
        <InputGroup>
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sales..."
          />
        </InputGroup>
      </form>
      <br></br>
      <Link to="/add" className="addbtn" style={{ fontWeight: "bold" }}>
        {" "}
        + Add new sale{" "}
      </Link>
      <br />
      <br />

      <button onClick={gridlayout} style={buttonStyle}>
        <i className="material-icons">view_module</i>
      </button>
      <button onClick={listLayout} style={buttonStyle2}>
        <i className="material-icons">list</i>
      </button>
      <br />
      <br />

      <button className="button-name" onClick={handlePrint}>
        Print
      </button>
      {grid && Array.isArray(sales) ? (
        <div className="grid-layout">
          {sales
            .filter(
              (sale) =>
                search.toLowerCase() === "" ||
                Object.values(sale).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(search)
                )
            )
            .sort((a, b) => new Date(b.dateSold) - new Date(a.dateSold)) // Sort the sales data here
            .map((sale, index) => (
              <div className="sale" key={sale.number}>
                <div className="card">
                  <p className="img">
                    <img
                      src={`http://localhost:8800/saleuploads/${sale.image}`}
                      alt={sale.image}
                      style={styles}
                    />
                  </p>
                  <hr />
                  <div className="content">
                    <p>
                      <b>Sale number:</b> {sale.number}
                    </p>
                    <p>
                      <b>Item Number:</b> {sale.pnumber}
                    </p>
                    <p>
                      <b>Item Code:</b> {sale.code}
                    </p>
                    <p>
                      <b>Description:</b> <b>{sale.description}</b>
                    </p>
                    <p>
                      <b>Colour:</b> {sale.colour}
                    </p>
                    <p>
                      <b>Price:</b> Ksh.{sale.price.toLocaleString()}
                    </p>
                    <span>
                      <b>Quantity:</b>
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {sale.quantity}
                    </span>
                    {isValid(new Date(sale.datesold)) ? (
                      <p>
                        <b>Date Sold:</b>{" "}
                        {format(new Date(sale.datesold), "EEEE, dd/MM/yyyy")}
                      </p>
                    ) : (
                      <p>Invalid date format</p>
                    )}
                    <p>
                      <b>Salesperson:</b> {sale.saleperson}
                    </p>
                    <span>
                      <b>Commission:</b>
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Ksh. {sale.commission.toLocaleString()}
                    </span>
                    <hr />
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Total:{" "}
                    </span>
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Ksh.{sale.total.toLocaleString()}
                    </span>
                    <br />
                    <button className="updatebtn">
                      <Link
                        to={`/update/${sale.number}`}
                        style={{ color: "black" }}
                      >
                        <i className="material-icons">edit</i>
                      </Link>
                    </button>
                    <button
                      className="deletebtn"
                      onClick={() => click(sale.number)}
                    >
                      <i className="material-icons">delete</i>
                    </button>
                    {!userWantsToDelete &&
                      selectedSaleNumber === sale.number && (
                        <div>
                          <p>Are you sure you want to delete?</p>
                          <button
                            className="addbtn"
                            onClick={() => handleYesClick(sale.number)}
                          >
                            Yes
                          </button>
                          <button className="backbtn" onClick={handleNoClick}>
                            No
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p></p>
      )}

      <div className="print-table">
        {list &&
          groupedSalesByDateSorted.map((date) => (
            <div key={date}>
              <h3>{format(new Date(date), "EEEE, MMMM do, yyyy")}</h3>
              <table className="salestable">
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Image
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Description{" "}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Colour{" "}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Item Number
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Code
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Receipt Number
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Total{" "}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Salesperson{" "}
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        backgroundColor: "#127a8c",
                        color: "white",
                      }}
                    >
                      Commission
                    </th>
                  </tr>
                  <tr>
                    <td colSpan="13">
                      <hr />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {groupedSalesByDate[date].map((sale, index) => (
                    <React.Fragment key={sale.number}>
                      <tr>
                        <td style={{ borderRight: "2px solid grey" }}>
                          <img
                            src={`http://localhost:8800/saleuploads/${sale.image}`}
                            alt={sale.image}
                            style={styles}
                            className="img2"
                          />
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor: "#e0e0e0",
                            fontWeight: "bold",
                          }}
                        >
                          {sale.description}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor: "#5bacba",
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          {sale.colour}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor: "#e0e0e0",
                            fontWeight: "bold",
                          }}
                        >
                          {sale.pnumber}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            fontWeight: "bold",
                            backgroundColor: "#5bacba",
                            color: "white",
                          }}
                        >
                          {sale.code}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {sale.number}
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "#5bacba",
                            color: "white",
                            padding: "10px",
                          }}
                        >
                          Ksh.{sale.price.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            backgroundColor: "#e0e0e0",
                            color: "purple",
                            fontWeight: "bold",
                          }}
                        >
                          {sale.quantity}
                        </td>
                        <td
                          style={{
                            padding: "14px",
                            backgroundColor: "#5bacba",
                            color: "white",
                          }}
                        >
                          <b>Ksh.{sale.total.toLocaleString()}</b>
                        </td>
                        <td
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            fontWeight: "bold",
                          }}
                        >
                          {sale.saleperson}
                        </td>
                        <td
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            backgroundColor: "#5bacba",
                          }}
                        >
                          Ksh.{sale.commission.toLocaleString()}
                        </td>
                        <td>
                          <button className="updatebtn">
                            <Link
                              to={`/update/:${sale.number}`}
                              style={{
                                color: "black",
                                ":hover": { color: "white" },
                              }}
                            >
                              <i className="material-icons">edit</i>
                            </Link>
                          </button>
                          <button
                            className="deletebtn"
                            onClick={() => click(sale.number)}
                          >
                            <i className="material-icons">delete</i>
                          </button>
                          {!userWantsToDelete &&
                            selectedSaleNumber === sale.number && (
                              <div>
                                <p>Are you sure you want to delete?</p>
                                <button
                                  className="addbtn"
                                  onClick={() => handleYesClick(sale.number)}
                                >
                                  Yes
                                </button>
                                <button
                                  className="backbtn"
                                  onClick={handleNoClick}
                                >
                                  No
                                </button>
                              </div>
                            )}
                        </td>
                      </tr>
                      {index < sales.length - 1 && (
                        <tr>
                          <td colSpan="13">
                            <hr />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  <tr>
                    <td colSpan="8" style={{ textAlign: "right" }}></td>
                    <td
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "green",
                      }}
                    >
                      Ksh. {totalAmountByDate[date]}
                    </td>
                    <td colSpan="1" style={{ textAlign: "right" }}></td>
                    <td
                      colSpan="1"
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "red",
                      }}
                    >
                      Ksh. {totalCommissionByDate[date]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
      </div>

      <p>Total Sales Amount: Ksh. {totalAmount}</p>
    </div>
  );
}

export default SalesTable;
