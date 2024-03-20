import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const Productstable = () => {
  const [products, setProducts] = useState([]);
  const [grid, setGrid] = useState(false);
  const [list, SetList] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState([
    "number",
    "location",
    "code",
    "description",
    "quantity",
  ]);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedProductNumber, setSelectedProductNumber] = useState(null);

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
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8800/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProducts();
  }, []);

  const click = (productNumber) => {
    setUserWantsToDelete(false);
    setSelectedProductNumber(productNumber);
  };

  const handleYesClick = async (number) => {
    try {
      await axios.delete(`http://localhost:8800/products/${number}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.number !== number)
      );
      setUserWantsToDelete(true);
      setSelectedProductNumber(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoClick = () => {
    setUserWantsToDelete(true);
    setSelectedProductNumber(null);
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

  const handleSort = (field) => {
    setSortOrder((prevSortOrder) =>
      field === sortField ? (prevSortOrder === "asc" ? "desc" : "asc") : "asc"
    );
    setSortField(field);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <form className="search-panels">
        <InputGroup className="search-groups">
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Products..."
          />
        </InputGroup>
      </form>
      <br />

      <Link to="/add" className="addbtn" style={{ fontWeight: "bold" }}>
        + Add product
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
      <button className="button-name" onClick={handlePrint}>
        Print
      </button>
      {grid && Array.isArray(products) ? (
        <div className="grid-layout">
          {products
            .filter(
              (product) =>
                search.toLowerCase() === "" ||
                Object.values(product).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(search)
                )
            )
            .sort((a, b) => {
              const fieldA =
                typeof a[sortField] === "string"
                  ? a[sortField].toLowerCase()
                  : String(a[sortField]).toLowerCase();
              const fieldB =
                typeof b[sortField] === "string"
                  ? b[sortField].toLowerCase()
                  : String(b[sortField]).toLowerCase();

              if (sortOrder === "asc") {
                return fieldA.localeCompare(fieldB);
              } else {
                return fieldB.localeCompare(fieldA);
              }
            })
            .map((product, index) => (
              <div className="product" key={product.number}>
                <div className="card">
                  <p className="img">
                    <img
                      src={`http://localhost:8800/uploads/${product.image}`}
                      alt={product.image}
                      style={styles}
                    />
                  </p>
                  <hr />
                  <div className="content">
                    <p>
                      <b>Product Number:</b> {product.number}
                    </p>
                    <p>
                      <b>Code:</b> {product.code}
                    </p>
                    <p>
                      <b>Description:</b> {product.description}
                    </p>
                    <p>
                      <b>Colour:</b> {product.colour}
                    </p>
                    <span>
                      <b>Quantity:</b>
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {product.quantity}
                    </span>
                    <p>
                      <b>B/No:</b> {product.bnumber}
                    </p>
                    <p>
                      <b>Location:</b> {product.location}
                    </p>
                    <p>
                      <b>Summary:</b> {product.summary}
                    </p>
                    <hr />
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "34px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Ksh.{product.price.toLocaleString()}
                    </span>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button className="updatebtn">
                        <Link
                          to={`/update/:${product.number}`}
                          style={{ color: "black" }}
                        >
                          <i className="material-icons">edit</i>
                        </Link>
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => click(product.number)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                      <br />
                    </div>{" "}
                    {!userWantsToDelete &&
                      selectedProductNumber === product.number && (
                        <div>
                          <p>Are you sure you want to delete?</p>
                          <button
                            className="addbtn"
                            onClick={() => handleYesClick(product.number)}
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
        {list && Array.isArray(products) ? (
          <table className="productstable">
            <thead>
              <tr>
                <th>Image</th>
                <th
                  style={{ verticalAlign: "middle" }}
                  onClick={() => handleSort("description")}
                >
                  Description
                </th>
                <th
                  className="th hover-pointer"
                  style={{ verticalAlign: "middle" }}
                  onClick={() => handleSort("code")}
                >
                  Colour
                </th>
                <th>Code</th>
                <th
                  className="th hover-pointer"
                  onClick={() => handleSort("number")}
                >
                  P/No{" "}
                </th>

                <th
                  className="th hover-pointer"
                  style={{ verticalAlign: "middle" }}
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                </th>
                <th>FC/No</th>
                <th>AMT</th>
                <th
                  className="th hover-pointer"
                  onClick={() => handleSort("location")}
                >
                  Location
                </th>
                <th>Summary</th>
              </tr>
              <tr>
                <td colSpan="14"></td>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(
                  (product) =>
                    search.toLowerCase() === "" ||
                    Object.values(product).some(
                      (value) =>
                        typeof value === "string" &&
                        value.toLowerCase().includes(search)
                    )
                )
                .sort((a, b) => {
                  const fieldA =
                    typeof a[sortField] === "string"
                      ? a[sortField].toLowerCase()
                      : String(a[sortField]).toLowerCase();
                  const fieldB =
                    typeof b[sortField] === "string"
                      ? b[sortField].toLowerCase()
                      : String(b[sortField]).toLowerCase();

                  if (sortOrder === "asc") {
                    return fieldA.localeCompare(fieldB);
                  } else {
                    return fieldB.localeCompare(fieldA);
                  }
                })
                .map((product, index) => (
                  <React.Fragment key={product.number}>
                    <tr>
                      <td>
                        {" "}
                        <img
                          src={`http://localhost:8800/uploads/${product.image}`}
                          alt={product.image}
                          style={styles}
                          className="img2"
                        />
                      </td>
                      <td
                        style={{
                          backgroundColor: "#e0e0e0",
                          fontWeight: "bold",
                        }}
                      >
                        {product.description}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.colour}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#e0e0e0",
                          fontWeight: "bold",
                        }}
                      >
                        {product.code}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.number}
                      </td>
                      <td
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          backgroundColor: "#e0e0e0",
                        }}
                      >
                        {product.quantity}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.bnumber}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#e0e0e0",
                          fontWeight: "bold",
                        }}
                      >
                        Ksh.{product.price.toLocaleString()}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.location}
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#e0e0e0",
                        }}
                      >
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                          <li
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              padding: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            {product.summary}
                          </li>
                        </ul>
                      </td>

                      <td>
                        <button className="updatebtn">
                          <Link
                            to={`/update/:${product.number}`}
                            style={{ color: "black" }}
                          >
                            <i className="material-icons">edit</i>
                          </Link>
                        </button>
                        <button
                          className="deletebtn"
                          onClick={() => click(product.number)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                        {!userWantsToDelete &&
                          selectedProductNumber === product.number && (
                            <div>
                              <p>Are you sure you want to delete?</p>
                              <button
                                className="addbtn"
                                onClick={() => handleYesClick(product.number)}
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
                    {index < products.length - 1 && (
                      <tr>
                        <td colSpan="14">
                          <hr />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Productstable;
