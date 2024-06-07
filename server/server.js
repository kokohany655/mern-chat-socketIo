const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const { dbConnections } = require("./config/database");
const { globalError } = require("./middleware/globalError");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const { app, server } = require("./socket/index");

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

dbConnections();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

app.use(globalError);

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
