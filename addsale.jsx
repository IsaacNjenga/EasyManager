import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddSale() {
  const [sale, setSale] = useState({
    number: "",
    description: "",
    price: 0,
    quantity: 0,
    total: 0,
    datesold: new Date(),
    saleperson: "",
    commission: 0,
    image: "",
    pnumber: "",
    code: "",
    colour: "",
  });

  const [products, setProducts] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [salesName, setSalesName] = useState([]);
  const [colourNames, setColourName] = useState([]);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imageSet, SetImageSet] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [proceed, setProceed] = useState(true);

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/products`);
        const items = response.data.map((item) => item.description);
        setItemNames(items);

        const response2 = await axios.get(`http://localhost:8800/staff`);
        const salesName = response2.data.map((saleName) => saleName.firstname);
        setSalesName(salesName);

        const response3 = await axios.get(`http://localhost:8800/products`);
        const colours = response3.data.map((colour) => colour.colour);
        setColourName(colours);

        const response4 = await axios.get("http://localhost:8800/products");
        setProducts(response4.data);
      } catch (err) {
        console.log("Error fetching item:", err);
      }
    };
    fetchItemNames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prev) => {
      const newValue =
        name === "description" || name === "saleperson" || name === "code"
          ? value.toUpperCase()
          : name === "colour"
          ? value
          : name === "quantity"
          ? parseInt(value) || 0
          : parseFloat(value) || 0;

      let updatedSale = { ...prev };

      if (name === "number") {
        updatedSale = {
          ...updatedSale,
          number: newValue,
        };
      } else if (name === "pnumber") {
        const selectedProduct = products.find(
          (product) => product.number === parseInt(value)
        );
        if (selectedProduct) {
          updatedSale = {
            ...updatedSale,
            description: selectedProduct.description,
            code: selectedProduct.code,
            colour: selectedProduct.colour,
            pnumber: selectedProduct.pnumber,
          };
        }
      }

      const total =
        name === "price" || name === "quantity"
          ? calculateTotal(
              name === "price" ? newValue : prev.price,
              name === "quantity" ? newValue : prev.quantity
            )
          : prev.total;

      const commission =
        name === "price" || name === "quantity"
          ? calculateCommission(total)
          : prev.commission;

      return {
        ...updatedSale,
        [name]: newValue,
        total: total,
        commission: commission,
      };
    });
  };

  const calculateTotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateCommission = (total) => {
    if (total >= 10000) {
      return 0.01 * total;
    }
    return 0;
  };

  const handleDateChange = (date) => {
    setSale((prev) => ({
      ...prev,
      datesold: date,
    }));
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:8800/saleupload",
        formData
      );
      const filename = response.data.file;
      setSale((prev) => ({ ...prev, image: filename }));
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
        await axios.post("http://localhost:8800/sales", sale);
        setShowAnimation(true); // Set showAnimation to true before the animation starts
        setTimeout(() => {
          setShowAnimation(false); // Set showAnimation to false after the animation duration
          navigate("/");
        }, 2500);
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

  return (
    <div>
      <button className="backbtn" onClick={back}>
        Back to Sales
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
          <h3>Sales entry</h3>
        </div>
        <hr />
        <br />
        <label>Receipt Number:</label>
        <input
          type="text"
          value={sale.number}
          onChange={handleChange}
          name="number"
        />
        <br />
        <br />
        <label>Select the Item:</label>
        <select
          style={{ width: "656px" }}
          name="pnumber"
          onChange={handleChange}
          value={sale.pnumber}
        >
          <option value="" disabled></option>
          <optgroup label="Item Number - Description (Code) | [Colour]">
            {products.map((product) => (
              <option
                className="select"
                key={product.number}
                value={product.number}
              >
                {`${product.number} - ${product.description} (${product.code}) | [${product.colour}]`}
              </option>
            ))}
          </optgroup>
        </select>
        <br />
        <br />
        <label>Description:</label>
        <select
          style={{ width: "600px" }}
          name="description"
          onChange={handleChange}
          value={sale.description}
        >
          <option value="" disabled>
            Select
          </option>
          {itemNames.map((itemName, index) => (
            <option key={index} value={itemName}>
              {itemName}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Colour:</label>
        <select
          style={{ width: "200px" }}
          name="colour"
          onChange={handleChange}
          value={sale.colour}
        >
          <option value="" disabled>
            Select
          </option>
          {[...new Set(colourNames)].map((colourName, index) => (
            <option key={index} value={colourName}>
              {colourName}
            </option>
          ))}
        </select>
        <br />
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
          <label>Price:</label>
          <input
            type="number"
            placeholder="Price"
            onChange={handleChange}
            name="price"
          />
          <label>Quantity:</label>
          <input
            type="number"
            placeholder="Quantity"
            onChange={handleChange}
            name="quantity"
          />
          <label>Total:</label>
          <input type="text" placeholder="Total" value={sale.total} readOnly />
          <label>Commission:</label>
          <input
            type="text"
            placeholder="Commission"
            value={sale.commission.toLocaleString()}
            readOnly
          />
        </div>
        <br />
        <hr />
        <br />
        <label>Date of Sale:</label>
        <DatePicker
          selected={sale.datesold}
          onChange={handleDateChange}
          dateFormat="EEEE, dd-MM-yyyy"
        />
        <br />
        <br />
        <label>Salesperson:</label>
        <select
          name="saleperson"
          onChange={handleChange}
          value={sale.saleperson}
        >
          <option value="" disabled>
            Select
          </option>
          {salesName.map((saleName) => (
            <option key={saleName} value={saleName}>
              {saleName}
            </option>
          ))}
        </select>
        <br />
        <br />
        <hr />
        <br />
        <label>Image:</label>
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
              src={`http://localhost:8800/uploads/${sale.image}`}
              alt={sale.image}
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
          Add Sale
        </button>
        <button className="backbtn" onClick={back}>
          Cancel
        </button>
      </form>
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

export default AddSale;
