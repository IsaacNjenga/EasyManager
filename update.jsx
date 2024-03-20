import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Update = () => {
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
  const [preLoaded, setPreLoaded] = useState({
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
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const productno = parseInt(
    location.pathname.split("/")[2].replace(":", ""),
    10
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/products/${productno}`
        );
        setPreLoaded(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [productno]);

  useEffect(() => {
    setProduct(preLoaded);
  }, [preLoaded]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputValueInCaps = inputValue.toUpperCase();
    setProduct((prev) => ({ ...prev, [e.target.name]: inputValueInCaps }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/products/${productno}`, product);
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        navigate("/");
      }, 2000);
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
        "http://localhost:8800/upload",
        formData
      );
      const filename = response.data.file;
      setProduct((prev) => ({ ...prev, image: filename }));
      setShowAlert(true);
      setImages(filename);
      console.log(images)
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
      <h1>Update Product</h1>
      <button className="backbtn" onClick={cancel}>
        Back to Inventory
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
          <h3>Product update</h3>
        </div>
        <hr />
        <br />
        Product Number:
        <input
          type="text"
          value={product.number}
          onChange={handleChange}
          name="number"
        />
        <br />
        Description:
        <input
          type="text"
          value={product.description}
          onChange={handleChange}
          name="description"
        />
        <br />
        Product Code:
        <input
          type="text"
          value={product.code}
          onChange={handleChange}
          name="code"
        />
        <br />
        Colour:
        <input
          type="text"
          value={product.colour}
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
            value={product.quantity}
            onChange={handleChange}
            name="quantity"
          />
          Price per unit:
          <input
            type="text"
            value={product.price}
            onChange={handleChange}
            name="price"
          />
          FC Number:
          <input
            type="text"
            value={product.bnumber}
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
          value={product.location}
          onChange={handleChange}
          name="location"
        />
        <br />
        <br />
        Summary
        <textarea
          value={product.summary}
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
            src={`http://localhost:8800/uploads/${product.image}`}
            alt={product.image}
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
};

export default Update;
