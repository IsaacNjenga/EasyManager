import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UpdateSale() {
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

  const [preLoaded, setPreLoaded] = useState({
    /*number: "",
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
    colour: "",*/
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [itemNames, setItemNames] = useState([]);
  const [salesName, setSalesName] = useState([]);
  const [colourNames, setColourName] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);

  const saleno = parseInt(location.pathname.split("/")[2].replace(":", ""), 10);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/sales/${saleno}`);

        const saleData = res.data[0];
        saleData.datesold = new Date(saleData.datesold);
        setPreLoaded(saleData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [saleno]);

  useEffect(() => {
    setSale(preLoaded); // Update sale with the fetched data
  }, [preLoaded]);

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
        ...prev,
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
    // Check if the new date is different from the current date
    if (date.getTime() !== sale.datesold.getTime()) {
      setSale((prev) => ({
        ...prev,
        datesold: date,
      }));
      console.log(date);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updating sale with data:", sale);
    try {
      await axios.put(`http://localhost:8800/sales/${saleno}`, sale);
      setShowAnimation(true); // Set showAnimation to true before the animation starts
      setTimeout(() => {
        setShowAnimation(false); // Set showAnimation to false after the animation duration
        navigate("/");
      }, 2500);
    } catch (err) {
      console.log(err);
    }
  };

  const cancel = () => {
    navigate("/");
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
      setShowAlert(true);
      setImages(filename);
    } catch (err) {
      console.error("Error adding product:", err);
    }
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

  return (
    <div>
      <h1>Update sale</h1>
      <button className="backbtn" onClick={cancel}>
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
          <h3>Sales update</h3>
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
          style={{ width: "600px" }}
          name="pnumber"
          onChange={handleChange}
          value={sale.pnumber}
        >
          <option value="" disabled>
            Select
          </option>
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
        <select name="colour" onChange={handleChange} value={sale.colour}>
          <option value="" disabled>
            Select the Colour
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
            value={sale.price}
            onChange={handleChange}
            name="price"
          />
          <label>Quantity:</label>
          <input
            type="number"
            value={sale.quantity}
            onChange={handleChange}
            name="quantity"
          />
          <label>Total:</label>
          <input type="text" value={sale.total} readOnly />
          <label>Commission:</label>
          <input type="text" value={sale.commission} readOnly />
        </div>
        <br />
        <br />
        <hr />
        <br />
        <label>Date of Sale:</label>
        <DatePicker
          selected={sale.datesold}
          onChange={handleDateChange}
          dateFormat="dd-MM-yyyy"
        />
        <br />
        <label>Salesperson:</label>
        <select
          name="saleperson"
          onChange={handleChange}
          value={sale.saleperson}
        >
          <option value="" disabled>
            Select saleperson
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
        <br />
        <hr />
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`http://localhost:8800/saleuploads/${sale.image}`}
            alt={sale.image}
            style={styles}
          />
        </div>
        <br />
        <input type="file" onChange={handleImageChange} name="image" />
        <button className="uploadbtn" onClick={handleImageSubmit}>
          Change image
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
        <button className="addbtn" onClick={handleSubmit}>
          Update
        </button>
        <button className="backbtn" onClick={cancel}>
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

export default UpdateSale;
