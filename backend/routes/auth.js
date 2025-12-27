// `import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import fs from "fs";

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const fs = require("fs");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const email = `${username}@${process.env.MAIL_DOMAIN}`;

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password: hash });

  // Create Maildir
  const dir = `/var/mail/vhosts/${process.env.MAIL_DOMAIN}/${username}`;
  fs.mkdirSync(dir + "/Maildir", { recursive: true });

  res.json({ success: true, email });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
