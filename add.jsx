import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  read as readExcel,
  utils as XLSXUtils,
  write as writeExcel,
} from "xlsx";
import fileSaver from "file-saver";

const Add = () => {
  const [product, setProduct] = useState({
    number: "",
    description: "",
    colour: "",
    price: "",
    quantity: "",
    image: "",
    code: "",
    location: "",
    bnumber: "",
    category: "",
    summary: "",
  });

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imageSet, SetImageSet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [productData, setProductData] = useState([]);
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
    setProduct((prev) => ({ ...prev, [e.target.name]: inputValueInCaps }));
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(
        "http://localhost:8800/upload",
        formData
      );
      const filename = response.data.file;
      console.log("Uploaded file with custom name:", filename);
      setProduct((prev) => ({ ...prev, image: filename }));
      setImages(filename);
      console.log(images);
      setShowAlert(true);
      setHasUploadedImage(true);
      setProceed(true);
      SetImageSet(true);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (hasUploadedImage !== true) {
        setProceed(false);
      } else {
        await axios.post("http://localhost:8800/products", product);
        setShowAnimation(true); // Set showAnimation to true before the animation starts
        setTimeout(() => {
          setShowAnimation(false); // Set showAnimation to false after the animation duration
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const back = () => {
    navigate("/");
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

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
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

      const productFromExcel = excelData.slice(1).map((row) => ({
        description: row[0].toUpperCase(),
        colour: row[1].toUpperCase(),
        code: row[2].toUpperCase(),
        number: row[3],
        quantity: row[4],
        bnumber: row[5].toUpperCase(),
        price: row[6],
        location: row[7].toUpperCase(),
        summary: row[8].toUpperCase(),
      }));
      setProductData(productFromExcel);
    };
    reader.readAsArrayBuffer(file);
  };

  const addExcelDoc = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        productData.map(async (productMember) => {
          try {
            await axios.post("http://localhost:8800/products", productMember);
          } catch (error) {
            console.error("Error adding product:", error);
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
    const headers = [
      "Description",
      "Colour",
      "Code",
      "P/No",
      "Quantity",
      "FC/No",
      "AMT",
      "Location",
      "Summary",
    ];
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
    fileSaver.saveAs(blob, "product-template.xlsx");
  };

  return (
    <div>
      <h1>Add new product</h1>
      <button className="backbtn" onClick={back}>
        Back to Inventory
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
          {productData.length > 0 && (
            <table className="productstable">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Colour</th>
                  <th>Code</th>
                  <th>P/No</th>
                  <th>Quantity</th>
                  <th>FC/No</th>
                  <th>AMT</th>
                  <th>Location</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {productData.map((product, index) => (
                  <tr key={index}>
                    <td>{product.description}</td>
                    <td>{product.colour}</td>
                    <td>{product.code}</td>
                    <td>{product.number}</td>
                    <td>{product.quantity}</td>
                    <td>{product.bnumber}</td>
                    <td>Ksh.{product.price.toLocaleString()}</td>
                    <td>{product.location}</td>
                    <td>{product.summary}</td>
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
              <h3>Product Entry</h3>
            </div>
            <hr />
            <br />
            Product Number:
            <input
              type="text"
              placeholder="12345"
              onChange={handleChange}
              name="number"
            />
            <br />
            Description:
            <input
              type="text"
              placeholder="Description"
              onChange={handleChange}
              name="description"
            />
            <br />
            Product Code:
            <input
              type="text"
              placeholder="XX123"
              onChange={handleChange}
              name="code"
            />
            <br />
            Colour:
            <input
              type="text"
              placeholder="Colour"
              onChange={handleChange}
              name="colour"
            />
            <br />
            <hr />
            <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
              }}
            >
              Quantity:
              <input
                type="text"
                placeholder="Quantity"
                onChange={handleChange}
                name="quantity"
              />
              Price per unit:
              <input
                type="text"
                placeholder="Price"
                onChange={handleChange}
                name="price"
              />
              FC Number:
              <input
                type="text"
                placeholder="B/No"
                onChange={handleChange}
                name="bnumber"
              />
            </div>
            <br />
            <hr />
            <br />
            Location:
            <input
              type="text"
              placeholder="Location"
              onChange={handleChange}
              name="location"
            />
            <br />
            <br />
            Summary
            <textarea
              onChange={handleChange}
              name="summary"
              rows="6"
              cols="76.5"
            ></textarea>
            <br />
            <br />
            <hr />
            <br />
            Image:
            <hr />
            <br />
            <input type="file" onChange={handleImageChange} name="image" />
            <button className="uploadbtn" onClick={handleImageSubmit}>
              Upload Image
            </button>
            <br />
            {imageSet && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={`http://localhost:8800/uploads/${product.image}`}
                  alt={product.image}
                  style={styles}
                />
              </div>
            )}
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
};

export default Add;
