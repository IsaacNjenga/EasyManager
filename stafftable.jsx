import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function StaffTable() {
  const [staffs, setStaffs] = useState([]);
  const [grid, setGrid] = useState(false);
  const [list, SetList] = useState(true);
  const [search, setSearch] = useState("");
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedStaffNumber, setSelectedstaffNumber] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function gridlayout() {
    setGrid(true);
    SetList(false);
  }

  function listLayout() {
    SetList(true);
    setGrid(false);
  }

  useEffect(() => {
    const fetchAllStaffs = async () => {
      try {
        const res = await axios.get("http://localhost:8800/staff");
        setStaffs(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllStaffs();
  }, []);

  const click = (staffNumber) => {
    setUserWantsToDelete(false);
    setSelectedstaffNumber(staffNumber);
  };

  const handleYesClick = async (number) => {
    try {
      await axios.delete(`http://localhost:8800/staff/${number}`);
      setStaffs((prevStaffs) =>
        prevStaffs.filter((staff) => staff.number !== number)
      );
      setUserWantsToDelete(true);
      setSelectedstaffNumber(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoClick = () => {
    setUserWantsToDelete(true);
    setSelectedstaffNumber(null);
    console.log(currentDateTime)
  };

  const styles = {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    maxHeight: "100%",
    borderRadius: "50%",
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

  return (
    <div>
      <Link to="/add" className="addbtn" style={{ fontWeight: "bold" }}>
        {" "}
        + Add new{" "}
      </Link>
      <br />
      <br />
      <button onClick={gridlayout} style={buttonStyle}>
        <i className="material-icons">view_module</i>
      </button>
      <button onClick={listLayout} style={buttonStyle2}>
        <i className="material-icons">list</i>
      </button>
      <form>
        <InputGroup>
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </InputGroup>
      </form>

      {grid && Array.isArray(staffs) ? (
        <div className="grid-layout">
          {staffs
            .filter(
              (staff) =>
                search.toLowerCase() === "" ||
                Object.values(staff).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(search)
                )
            )
            .map((staff, index) => (
              <div className="product" key={staff.number}>
                <div className="card">
                  <p className="img">
                    <img
                      src={`http://localhost:8800/staffuploads/${staff.image}`}
                      alt={staff.image}
                      style={styles}
                    />
                  </p>
                  <hr />
                  <div className="content">
                    <p>
                      <b>Sales ID:</b> {staff.number}
                    </p>
                    <p>
                      <b>First name:</b> {staff.firstname}
                    </p>
                    <p>
                      <b>Last name:</b> {staff.lastname}
                    </p>
                    <p>
                      <b>ID Number:</b> {staff.id}
                    </p>
                    {isValid(new Date(staff.datejoined)) ? (
                      <p>
                        <b>Date joined:</b>{" "}
                        {format(new Date(staff.datejoined), "dd-MM-yyyy")}
                      </p>
                    ) : (
                      <p>Invalid date format</p>
                    )}
                    <hr />
                    <button className="updatebtn">
                      <Link
                        to={`/update/:${staff.number}`}
                        style={{ color: "black" }}
                      >
                        <i className="material-icons">edit</i>
                      </Link>
                    </button>
                    <button
                      className="deletebtn"
                      onClick={() => click(staff.number)}
                    >
                      <i className="material-icons">delete</i>
                    </button>{!userWantsToDelete &&
                        selectedStaffNumber === staff.number && (
                          <div>
                            <p>Are you sure you want to delete?</p>
                            <button
                              className="addbtn"
                              onClick={() => handleYesClick(staff.number)}
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

      {list && Array.isArray(staffs) ? (
        <table className="productstable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Sales ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>ID Number</th>
              <th>Date joined</th>
            </tr>
            <tr>
              <td colSpan="10">
                <hr />
              </td>
            </tr>
          </thead>
          <tbody>
            {staffs
              .filter((staff) => {
                return (
                  search.toLowerCase() === "" ||
                  Object.values(staff).some(
                    (value) =>
                      typeof value === "string" &&
                      value.toLowerCase().includes(search)
                  )
                );
              })
              .map((staff, index) => (
                <React.Fragment key={staff.number}>
                  <tr>
                    <td>
                      <img
                        className="img2"
                        src={`http://localhost:8800/staffuploads/${staff.image}`}
                        alt={staff.image}
                        style={styles}
                      />
                    </td>
                    <td
                      style={{
                        backgroundColor: "#e0e0e0",
                        fontWeight: "bold",
                      }}
                    >
                      {staff.number}
                    </td>
                    <td style={{ backgroundColor: "#5bacba", color: "white" }}>
                      {staff.firstname}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#e0e0e0",
                        fontWeight: "bold",
                      }}
                    >
                      {staff.lastname}
                    </td>
                    <td style={{ backgroundColor: "#5bacba", color: "white" }}>
                      {staff.id}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#e0e0e0",
                        fontWeight: "bold",
                      }}
                    >
                      {format(new Date(staff.datejoined), "dd-MM-yyyy")}
                    </td>
                    <td>
                      <button className="updatebtn">
                        <Link
                          to={`/update/:${staff.number}`}
                          style={{ color: "black" }}
                        >
                          <i className="material-icons">edit</i>
                        </Link>
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => click(staff.number)}
                      >
                        <i className="material-icons">delete</i>
                      </button>

                      {!userWantsToDelete &&
                        selectedStaffNumber === staff.number && (
                          <div>
                            <p>Are you sure you want to delete?</p>
                            <button
                              className="addbtn"
                              onClick={() => handleYesClick(staff.number)}
                            >
                              Yes
                            </button>
                            <button className="backbtn" onClick={handleNoClick}>
                              No
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                  {index < staffs.length - 1 && (
                    <tr>
                      <td colSpan="10">
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
  );
}

export default StaffTable;
