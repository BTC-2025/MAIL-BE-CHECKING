// `import express from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import fs from "fs";

// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User.js");
// const fs = require("fs");

// const router = express.Router();

// /* REGISTER */
// router.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   const email = `${username}@${process.env.MAIL_DOMAIN}`;

//   const hash = await bcrypt.hash(password, 12);
//   const user = await User.create({ email, password: hash });

//   // Create Maildir
//   const dir = `/var/mail/vhosts/${process.env.MAIL_DOMAIN}/${username}`;
//   fs.mkdirSync(dir + "/Maildir", { recursive: true });

//   res.json({ success: true, email });
// });

// /* LOGIN */
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (!user || !(await bcrypt.compare(password, user.password)))
//     return res.status(401).json({ msg: "Invalid credentials" });

//   const token = jwt.sign({ email }, process.env.JWT_SECRET);
//   res.json({ token });
// });

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { exec } = require("child_process");

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password)
//       return res.status(400).json({ success: false, msg: "Missing fields" });

//     const email = `${username}@btctech.shop`;

//     // Create Linux user without shell access
//     const cmd = `
//       sudo /usr/sbin/useradd -m -s /usr/sbin/nologin ${username} &&
//       echo "${username}:${password}" | sudo /usr/sbin/chpasswd
//     `;

//     exec(cmd, (err) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ success: false, error: err.message });
//       }

//       return res.json({ success: true, email });
//     });

//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;


// const express = require("express");
// const { exec } = require("child_process");
// const bcrypt = require("bcrypt");

// const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password)
//       return res.status(400).json({ success: false, msg: "Missing fields" });

//     const email = `${username}@btctech.shop`;

//     // hash password for DB login
//     const hash = await bcrypt.hash(password, 12);

//     // Linux create user (NO SHELL login)
//     const cmd = `
//       /usr/sbin/useradd -m -s /usr/sbin/nologin ${username} &&
//       echo "${username}:${password}" | /usr/sbin/chpasswd &&
//       mkdir -p /home/${username}/mail &&
//       chown -R ${username}:${username} /home/${username}
//     `;

//     exec(cmd, async (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ success: false, error: err.message });
//       }

//       // Save user to Mongo(optional)
//       // await User.create({ email, password: hash });

//       return res.json({ success: true, email });
//     });

//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const { exec } = require("child_process");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, msg: "Missing fields" });

    const email = `${username}@btctech.shop`;

    // hash password for database (optional)
    const hash = await bcrypt.hash(password, 12);

    // Create Linux user with NO LOGIN + Maildir
    const cmd = `
      /usr/sbin/useradd -m -s /usr/sbin/nologin ${username} &&
      echo "${username}:${password}" | /usr/sbin/chpasswd &&
      maildirmake.dovecot /home/${username}/Maildir &&
      chown -R ${username}:${username} /home/${username}/Maildir
    `;

    exec(cmd, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err.message });
      }

      // OPTIONAL — Save to MongoDB:
      // await User.create({ email, password: hash });

      return res.json({ success: true, email });
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
