// import { fetchInbox } from "../config/mail.js";
const { fetchInbox } = require("../config/mail.js");
const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/inbox", auth, async (req, res) => {
  const mails = await fetchInbox(req.user.email, req.body.password);
  res.json(mails);
});

module.exports = router;
