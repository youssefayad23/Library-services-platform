const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const admin = require("./router/admin");
const user = require("./router/user");
const book = require("./router/book");
const adminAuth = require("./middlewares/admin");
const auther = require("./middlewares/auther");
// auther, adminAuth,
app.use("/admin", admin);
app.use("/", user);
app.use("/book", book);
app.use("/uploads", express.static("./uploads"));

app.listen(4000, "localhost", () => {
  console.log("Server Is Runing");
});
