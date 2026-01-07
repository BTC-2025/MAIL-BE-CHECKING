const express = require("express");
const { ImapFlow } = require("imapflow");

const router = express.Router();

router.post("/get", async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, msg: "Missing email/password" });

  const client = new ImapFlow({
    host: "mail.btctech.shop",
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: password
    },
    logger: false
  });

  try {
    await client.connect();

    // Select INBOX
    let lock = await client.getMailboxLock("INBOX");

    let messages = [];

    // Fetch latest 20 messages
    for await (let msg of client.fetch(
      { seen: false },     // fetch unread only (change to {} for all)
      { envelope: true, source: false, bodyStructure: false }
    )) {
      messages.push({
        uid: msg.uid,
        subject: msg.envelope.subject,
        from: msg.envelope.from?.[0]?.address,
        date: msg.envelope.date
      });
    }

    lock.release();
    await client.logout();

    return res.json({
      success: true,
      inbox: messages
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message || "IMAP error"
    });
  }
});

module.exports = router;
