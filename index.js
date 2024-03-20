import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import moment from "moment";
import path from "path";

const app = express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "managementsystem",
});

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    req.intendedFilename = filename;
    cb(null, filename);
  },
});

const saleStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/saleuploads");
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    req.intendedFilename = filename;
    cb(null, filename);
  },
});

const staffStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/staffuploads");
  },
  filename: function (req, file, cb) {
    const filename = `${file.originalname}`;
    req.intendedFilename = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
const saleUpload = multer({ storage: saleStorage });
const staffUpload = multer({ storage: staffStorage });

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    const originalFilename = req.file.originalname;
    res.json({ file: originalFilename });
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/saleupload", saleUpload.single("image"), (req, res) => {
  try {
    const originalFilename = req.file.originalname;
    res.json({ file: originalFilename });
  } catch (err) {
    console.log("Error uploading:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/staffupload", staffUpload.single("image"), (req, res) => {
  try {
    const originalFilename = req.file.originalname;
    res.json({ file: originalFilename });
  } catch (err) {
    console.log("Error uploading:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.json("Hello from backend");
});

app.get("/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.post("/products", (req, res) => {
  const query =
    "INSERT INTO products (`number`,`description`,`colour`,`price`,`quantity`,`image`,`code`,`location`,`bnumber`,`category`,`summary`) VALUES (?)";
  const values = [
    req.body.number,
    req.body.description,
    req.body.colour,
    req.body.price,
    req.body.quantity,
    req.body.image,
    req.body.code,
    req.body.location,
    req.body.bnumber,
    req.body.category,
    req.body.summary,
  ];
  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product created successfully!");
  });
});

app.post("/login", (req, res) => {
  const query = "INSERT INTO login (`username`,`password`) VALUES (?)";
  const values = [req.body.username, req.body.password];
  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("user added successfully");
  });
});

app.delete("/products/:number", (req, res) => {
  const productno = req.params.number;
  const query = "DELETE FROM products WHERE `number` = ?";

  db.query(query, [productno], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product deleted successfully!");
  });
});

app.get("/products/:number", (req, res) => {
  const productno = req.params.number;
  const query = "SELECT * FROM products WHERE `number` = ?";
  db.query(query, [productno], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.json(err);
    }

    res.json(data);
  });
});

app.get("/expenses", (req, res) => {
  const query = "SELECT * FROM expenses";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/login", (req, res) => {
  const query = "SELECT * FROM login";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/expenses/:number", (req, res) => {
  const expenseno = req.params.number;
  const query = "SELECT * FROM expenses WHERE `number` = ?";
  db.query(query, [expenseno], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.json(err);
    }
    res.json(data);
  });
});

app.get("/sales/:number", (req, res) => {
  const saleno = req.params.number;
  const query = "SELECT * FROM sales WHERE `number` = ?";
  db.query(query, [saleno], (err, data) => {
    if (err) {
      return res.json(err);
    }
    res.json(data);
  });
});

app.get("/staff/:number", (req, res) => {
  const staffno = req.params.number;
  const query = "SELECT * FROM staff WHERE `number` = ?";
  db.query(query, [staffno], (err, data) => {
    if (err) {
      return res.json(err);
    }
    res.json(data);
  });
});

app.put("/products/:number", (req, res) => {
  const productno = req.params.number;
  const query =
    "UPDATE products SET `number` = ?, `description` = ?, `colour` = ?, `price` = ?, `quantity` = ?, `image` = ?, `code` = ?, `location` = ?,`bnumber` = ?,`category` = ?, `summary` = ? WHERE `number` = ?";
  const values = [
    req.body.number,
    req.body.description,
    req.body.colour,
    req.body.price,
    req.body.quantity,
    req.body.image,
    req.body.code,
    req.body.location,
    req.body.bnumber,
    req.body.category,
    req.body.summary,
    productno,
  ];
  db.query(query, [...values, productno], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product updated successfully!");
  });
});

app.put("/login/:username", (req, res) => {
  const username = req.params.username;
  const query =
    "UPDATE login SET `username` = ?, `password` = ? WHERE `username` = ?";
  const values = [req.body.username, req.body.password, username];
  db.query(query, [...values, username], (err, data) => {
    if (err) return res.json(err);
    return res.json("Credentials updated successfully!");
  });
});

app.put("/expenses/:number", (req, res) => {
  const expenseno = req.params.number;
  const query =
    "UPDATE expenses SET `number` = ?, `description` = ?, `cost` = ?, `category` = ?, `date` = ? WHERE `number` = ?";

  const dateOfExpense = moment(req.body.date).local().format("YYYY-MM-DD");
  const values = [
    req.body.number,
    req.body.description,
    req.body.cost,
    req.body.category,
    dateOfExpense,
    expenseno, // Use expenseno as a placeholder in the query string
  ];
  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json("Expense updated successfully");
  });
});

app.get("/sales", (req, res) => {
  const query = "SELECT * FROM sales";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.get("/staff", (req, res) => {
  const query = "SELECT * FROM staff";
  db.query(query, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

app.post("/sales", async (req, res) => {
  const queryInsertSale =
    "INSERT INTO sales (`number`, `description`, `price`, `quantity`, `total`, `datesold`, `saleperson`, `commission`, `image`,`pnumber`,`code`,`colour`) VALUES (?)";
  const values = [
    req.body.number,
    req.body.description,
    req.body.price,
    req.body.quantity,
    req.body.total,
    req.body.datesold,
    req.body.saleperson,
    req.body.commission,
    req.body.image,
    req.body.pnumber,
    req.body.code,
    req.body.colour,
  ];

  db.query(queryInsertSale, [values], async (err, data) => {
    if (err) return res.json(err);

    // Update products table to subtract the sold quantity
    const queryUpdateProduct =
      "UPDATE products SET `quantity` = `quantity` - ? WHERE `number` = ?";
    db.query(
      queryUpdateProduct,
      [req.body.quantity, req.body.pnumber],
      (errUpdate, dataUpdate) => {
        if (errUpdate) {
          console.error("Error updating products table:", errUpdate);
          return res.json(errUpdate);
        }

        return res.json("Sale created successfully!");
      }
    );
  });
});

app.post("/staff", (req, res) => {
  const query =
    "INSERT INTO staff (`id`,`firstname`,`lastname`,`number`,`datejoined`,`image`) VALUES (?)";
  const values = [
    req.body.id,
    req.body.firstname,
    req.body.lastname,
    req.body.number,
    req.body.datejoined,
    req.body.image,
  ];
  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Staff added successfully");
  });
});

app.post("/expenses", (req, res) => {
  const query =
    "INSERT INTO expenses (`number`,`description`,`cost`,`category`,`date`) VALUES (?)";
  const values = [
    req.body.number,
    req.body.description,
    req.body.cost,
    req.body.category,
    req.body.date,
  ];
  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Expense added successfully");
  });
});

app.delete("/sales/:number", (req, res) => {
  const saleno = req.params.number;
  const query = "DELETE FROM sales WHERE `number` = ?";

  db.query(query, [saleno], (err, data) => {
    if (err) return res.json(err);
    return res.json("Sale deleted successfully!");
  });
});

app.delete("login/:username", (req, res) => {
  const username = req.params.username;
  const query = "DELETE FROM login WHERE `username` = ?";
  db.query(query, [username], (err, data) => {
    if (err) return res.json(err);
    return res.json("User deleted successfully");
  });
});

app.delete("/staff/:number", (req, res) => {
  const staffno = req.params.number;
  const query = "DELETE FROM staff WHERE `number` = ?";

  db.query(query, [staffno], (err, data) => {
    if (err) return res.json(err);
    return res.json("Staff deleted successfully!");
  });
});

app.delete("/expenses/:number", (req, res) => {
  const expenseno = req.params.number;
  const query = "DELETE FROM expenses WHERE `number` = ?";
  db.query(query, [expenseno], (err, data) => {
    if (err) return res.json(err);
    return res.json("Expense deleted successfully!");
  });
});

app.put("/sales/:number", (req, res) => {
  const saleno = req.params.number;
  const query =
    "UPDATE sales SET `number` = ?, `description` = ?, `price` = ?, `quantity` = ?, `total` = ?, `datesold` = ?, `saleperson` = ?, `commission` = ?, `image` = ?, `pnumber` = ?,`code` = ?,`colour` = ? WHERE `number` = ?";

  // Convert datesold to local timezone
  const datesoldLocal = moment(req.body.datesold).local().format("YYYY-MM-DD");

  const values = [
    req.body.number,
    req.body.description,
    req.body.price,
    req.body.quantity,
    req.body.total,
    datesoldLocal, // Use the adjusted local date
    req.body.saleperson,
    req.body.commission,
    req.body.image,
    req.body.pnumber,
    req.body.code,
    req.body.colour,
    saleno,
  ];

  db.query(query, values, (err, data) => {
    if (err) {
      console.error("Error updating sale:", err);
      return res.json(err);
    }
    console.log("Updated datesold:", datesoldLocal);
    return res.json("Sale updated successfully!");
  });
});

app.put("/staff/:number", (req, res) => {
  const staffno = req.params.number;
  const query =
    "UPDATE staff SET `id` = ?, `firstname` = ?, `lastname` = ?, `number` = ?, `datejoined` = ?, `image` = ? WHERE `number` = ?";
  const values = [
    req.body.id,
    req.body.firstname,
    req.body.lastname,
    req.body.number,
    req.body.datejoined,
    req.body.image,
    staffno,
  ];

  db.query(query, [...values, staffno], (err, data) => {
    if (err) return res.json(err);
    return res.json("Staff updated successfully!");
  });
});

app.get("/sales", (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const query = "SELECT * FROM sales WHERE DATE(datesold) = ?";
  db.query(query, [formattedDate], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected!");
});
