const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const dotenv = require("dotenv");

const { dbConnections } = require("./config/database");
const { globalError } = require("./middleware/globalError");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

dbConnections();

app.use(cookie());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

app.use(globalError);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running ... ${port}`);
});
