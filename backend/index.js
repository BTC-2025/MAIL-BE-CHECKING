// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/auth.js";
// import mailRoutes from "./routes/mail.js";
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const mailRoutes = require("./routes/mail.js");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Mail API running on http://localhost:${process.env.PORT}`)
);
