import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  read as readExcel,
  utils as XLSXUtils,
  write as writeExcel,
} from "xlsx";
import { format } from "date-fns";
import fileSaver from "file-saver";

function StaffAdd() {
  const [staff, setStaff] = useState({
    id: "",
    firstname: "",
    lastname: "",
    number: "",
    datejoined: new Date(),
    image: "",
  });

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [proceed, setProceed] = useState(true);
  const [excel, setExcel] = useState(false);
  const [singleEntry, setSingleEntry] = useState(false);

  const excelEntry = () => {
    setExcel(true);
    setSingleEntry(false);
  };

  const individualEntry = () => {
    setSingleEntry(true);
    setExcel(false);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputValueInCaps = inputValue.toUpperCase();
    setStaff((prev) => ({
      ...prev,
      [e.target.name]: inputValueInCaps,
    }));
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(
        "http://localhost:8800/staffupload",
        formData
      );
      const filename = response.data.file;
      console.log("Uploaded file with custom name:", filename);
      setStaff((prev) => ({ ...prev, image: filename }));
      setImages(filename);
      setShowAlert(true);
      console.log(images);
      setHasUploadedImage(true);
      setProceed(true);
    } catch (err) {
      console.error("Error adding staff:", err);
    }
  };

  const handleDateChange = (date) => {
    setStaff((prev) => ({
      ...prev,
      datejoined: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (hasUploadedImage !== true) {
        setProceed(false);
      } else {
        await axios.post(`http://localhost:8800/staff`, staff);
        setShowAnimation(true); // Set showAnimation to true before the animation starts
        setTimeout(() => {
          setShowAnimation(false); // Set showAnimation to false after the animation duration
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const back = () => {
    navigate("/");
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
  };

  const parseDateString = (dateString) => {
    if (!isNaN(dateString)) {
      // Check if dateString is a number
      const excelSerialDate = parseFloat(dateString);
      const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch starts from 1900-01-01 (with a 2-day adjustment)
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const utcMilliseconds = excelSerialDate * millisecondsPerDay;
      const date = new Date(excelEpoch.getTime() + utcMilliseconds);
      return date;
    } else {
      console.log("Invalid date string:", dateString);
      return new Date(); // Return current date as fallback
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = readExcel(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSXUtils.sheet_to_json(sheet, {
        header: 1,
        dateNF: "yyyy-mm-dd",
      });

      const staffFromExcel = excelData.slice(1).map((row) => ({
        id: row[0],
        firstname: row[1].toUpperCase(),
        lastname: row[2].toUpperCase(),
        number: row[3],
        datejoined: parseDateString(row[4]), // Assuming date format is consistent
      }));
      setStaffData(staffFromExcel);
    };
    reader.readAsArrayBuffer(file);
  };

  const addExcelDoc = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        staffData.map(async (staffMember) => {
          try {
            await axios.post("http://localhost:8800/staff", staffMember);
          } catch (error) {
            console.error("Error adding staff:", error);
          }
        })
      );
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const generateExcelTemplate = () => {
    const headers = ["ID", "First Name", "Last Name", "Number", "Date Joined"];
    const data = [headers];
    const workbook = XLSXUtils.book_new();
    const worksheet = XLSXUtils.aoa_to_sheet(data);
    XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelFile = writeExcel(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
    const blob = new Blob([s2ab(excelFile)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fileSaver.saveAs(blob, "staff-template.xlsx");
  };

  return (
    <div>
      <h2>Add new staff</h2>
      <button className="backbtn" onClick={back}>
        Back to Staff
      </button>
      <div className="entry-container">
        <p className="text-content">
          Add from <br /> Excel Document or Single Entry?
        </p>
        <div className="btnbox">
          <button className="excelbtn" onClick={excelEntry}>
            Excel Document
          </button>{" "}
          <button className="singlebtn" onClick={individualEntry}>
            Single Entry
          </button>
        </div>
      </div>

      {excel && (
        <div>
          <label>Get the Excel document from here:</label>
          <button onClick={generateExcelTemplate}>Download Template</button>
          <br />
          <br />
          <h3>Upload Document</h3>
          <input
            type="file"
            style={{ width: "300px" }}
            onChange={handleExcelUpload}
            accept=".xlsx,.xls"
          />
          <br />
          <button onClick={addExcelDoc}>Upload Excel Document</button>
          <br />
          <hr />
          {staffData.length > 0 && (
            <table className="productstable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Number</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={index}>
                    <td>{staff.id}</td>
                    <td>{staff.firstname}</td>
                    <td>{staff.lastname}</td>
                    <td>{staff.number}</td>
                    <td>{format(new Date(staff.datejoined), "yyyy-MM-dd")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {singleEntry && (
        <div>
          <form className="form">
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "35px",
                  color: "purple",
                  fontStyle: "italic",
                }}
              >
                Easy
              </span>
              <span
                style={{ fontSize: "35px", color: "red", fontWeight: "bold" }}
              >
                Manager
              </span>
              <h3>Staff Entry</h3>
            </div>
            <hr />
            <br />
            ID Number:
            <input
              type="text"
              placeholder="ID Number"
              onChange={handleChange}
              name="id"
            />
            <br />
            First Name:
            <input
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              name="firstname"
            />
            Last Name:
            <input
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              name="lastname"
            />
            Staff Number:
            <input
              type="text"
              placeholder="Staff Number"
              onChange={handleChange}
              name="number"
            />
            Date Joined:
            <DatePicker
              selected={staff.datejoined}
              onChange={handleDateChange}
            />
            <br />
            Image:
            <input type="file" onChange={handleImageChange} name="image" />
            <button className="uploadbtn" onClick={handleImageSubmit}>
              Upload Image
            </button>
            <br />
            {showAlert && (
              <div className="alert">
                <p>
                  Image uploaded successfully!{" "}
                  <i className="material-icons">check</i>{" "}
                </p>
              </div>
            )}
            <hr />
            {!proceed && (
              <div class="error">
                <div class="error__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    viewBox="0 0 24 24"
                    height="24"
                    fill="none"
                  >
                    <path
                      fill="#393a37"
                      d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"
                    ></path>
                  </svg>
                </div>
                <div class="error__title">Click on "Upload Image" first</div>
                <div class="error__close">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    viewBox="0 0 20 20"
                    height="20"
                  >
                    <path
                      fill="#393a37"
                      d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"
                    ></path>
                  </svg>
                </div>
              </div>
            )}
            <button className="addbtn" onClick={handleSubmit}>
              Add Product
            </button>
            <button className="backbtn" onClick={back}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {showAnimation && (
        <div className="hourglassOverlay">
          <div className="hourglassBackground">
            <div className="hourglassContainer">
              <div className="hourglassCurves"></div>
              <div className="hourglassCapTop"></div>
              <div className="hourglassGlassTop"></div>
              <div className="hourglassSand"></div>
              <div className="hourglassSandStream"></div>
              <div className="hourglassCapBottom"></div>
              <div className="hourglassGlass"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAdd;
