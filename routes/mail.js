const express = require("express");
const router = express.Router();
const connectIMAP = require("../config/imap");

router.post("/inbox", async (req, res) => {
    const { email, password } = req.body;

    try {
        const client = await connectIMAP(email, password);

        // Open inbox
        let lock = await client.getMailboxLock("INBOX");

        let messages = [];

        try {
            for await (let msg of client.fetch("1:*", {
                envelope: true,
                source: false,
                bodyStructure: true,
                bodyParts: true
            })) {
                messages.push({
                    uid: msg.uid,
                    from: msg.envelope.from?.map(f => f.address).join(", "),
                    to: msg.envelope.to?.map(t => t.address).join(", "),
                    subject: msg.envelope.subject,
                    date: msg.envelope.date,
                });
            }
        } finally {
            lock.release();
        }

        await client.logout();

        res.json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
