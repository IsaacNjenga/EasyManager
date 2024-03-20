import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function StaffUpdate() {
  const [staff, setStaff] = useState({
    id: "",
    firstname: "",
    lastname: "",
    number: "",
    datejoined: new Date(),
  });

  const [preLoaded, setPreLoaded] = useState({
    id: "",
    firstname: "",
    lastname: "",
    number: "",
    datejoined: new Date(),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const staffno = parseInt(
    location.pathname.split("/")[2].replace(":", ""),
    10
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/staff/${staffno}`);
        const staffData = res.data[0];

        // Parse the datejoined property into a Date object
        staffData.datejoined = new Date(staffData.datejoined);

        setPreLoaded(staffData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [staffno]);

  useEffect(() => {
    setStaff(preLoaded);
  }, [preLoaded]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputValueInCaps = inputValue.toUpperCase();
    setStaff((prev) => ({
      ...prev,
      [e.target.name]: inputValueInCaps,
    }));
  };

  const handleDateChange = (date) => {
    setStaff((prev) => ({
      ...prev,
      datejoined: date,
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
      setStaff((prev) => ({ ...prev, image: filename }));
      setImages(filename);
      setShowAlert(true);
    } catch (err) {
      console.error("Error adding staff:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8800/staff/${staffno}`, staff);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const cancel = () => {
    navigate("/");
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImage(selectedFile);
  };

  return (
    <div>
      <h1>Staff Update</h1>
      <form className="form">
        ID Number:
        <input type="text" value={staff.id} onChange={handleChange} name="id" />
        <br />
        First Name:
        <input
          type="text"
          value={staff.firstname}
          onChange={handleChange}
          name="firstname"
        />
        Last Name:
        <input
          type="text"
          value={staff.lastname}
          onChange={handleChange}
          name="lastname"
        />
        Staff Number:
        <input
          type="text"
          value={staff.number}
          onChange={handleChange}
          name="number"
        />
        Date Joined:
        <DatePicker selected={staff.datejoined} onChange={handleDateChange} />
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
        <button className="addbtn" onClick={handleSubmit}>
          Update
        </button>
        <button className="backbtn" onClick={cancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default StaffUpdate;
