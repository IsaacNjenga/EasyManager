import React, { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./dashboard";
import Products from "./products";
import Sales from "./sales";
import Expenses from "./expenses";
import Returns from "./returns";
import Staff from "./staff";
import Reports from "./reports";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  let [currentDateTime, setCurrentDateTime] = useState(new Date());

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "sales":
        return <Sales />;
      case "expenses":
        return <Expenses />;
      case "returns":
        return <Returns />;
      case "staff":
        return <Staff />;
      case "reports":
        return <Reports />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-UK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateTimeStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "20px",
    fontWeight: "bold",
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("mySidenav");
      const sticky = navbar.offsetTop;

      if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    setNavOpen(true);
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    setNavOpen(false);
  }

  return (
    <div>
      <div>
        <div id="timenav" className="time" style={dateTimeStyle}>
          <p>{formattedDate}</p>
          <p>{formattedTime}</p>
        </div>
        <div id="mySidenav" className={`sidenav ${navOpen ? "open" : ""}`}>
          <a href="#nav" className="closebtn" onClick={closeNav}>
            &times;
          </a>
          <a
            className="active"
            href="#dashboard"
            onClick={() => setCurrentView("dashboard")}
          >
            <i class="glyphicon glyphicon-home"></i> Dashboard
          </a>
          <a href="#products" onClick={() => setCurrentView("products")}>
            <i className="material-icons">assessment</i> Inventory
          </a>
          <a href="#sales" onClick={() => setCurrentView("sales")}>
            <i className="material-icons">shopping_cart</i> Sales
          </a>
          <a href="#expenses" onClick={() => setCurrentView("expenses")}>
            <i className="material-icons">style</i> Expenses
          </a>
          <a href="#returns" onClick={() => setCurrentView("returns")}>
            <i className="material-icons">import_export</i> Returns
          </a>
          <a href="#staff" onClick={() => setCurrentView("staff")}>
            <i className="material-icons">group</i> Salespersons
          </a>
          <a href="#reports" onClick={() => setCurrentView("reports")}>
            <i className="material-icons">poll</i> Reports
          </a>
         
        </div>
        <button className="menubtn" onClick={openNav}>
          <i className="material-icons" style={{ fontSize: "48px" }}>
            menu
          </i>
        </button>

        <div id="main">{renderView()}</div>
      </div>
    </div>
  );
}

export default App;
