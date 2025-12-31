const express = require("express");
const router = express.Router();
const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");

router.post("/get", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ success: false, message: "Email & password required" });

    const client = new ImapFlow({
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        secure: process.env.IMAP_SECURE === "true",
        auth: {
            user: email,
            pass: password
        }
    });

    try {
        await client.connect();

        // Select inbox
        const lock = await client.getMailboxLock("INBOX");

        const messages = [];
        let count = 0;

        try {
            // Get last 20 messages
            for await (let msg of client.fetch(
                { seq: `${client.mailbox.exists - 19}:*` },
                { envelope: true, source: true, internalDate: true }
            )) {
                const parsed = await simpleParser(msg.source);

                messages.push({
                    subject: parsed.subject || "",
                    from: parsed.from?.value?.[0]?.address || "",
                    fromName: parsed.from?.value?.[0]?.name || "",
                    date: msg.internalDate,
                    text: parsed.text?.slice(0, 120) || "",
                    html: parsed.html || ""
                });

                count++;
                if (count >= 20) break;
            }
        } finally {
            lock.release();
        }

        await client.logout();

        return res.json({
            success: true,
            total: messages.length,
            emails: messages.reverse() // newest last
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
