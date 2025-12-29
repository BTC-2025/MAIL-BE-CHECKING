const { ImapFlow } = require("imapflow");

async function connectIMAP(email, password) {
    const client = new ImapFlow({
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        secure: process.env.IMAP_SECURE === "true",
        auth: { user: email, pass: password }
    });

    await client.connect();
    return client;
}

module.exports = connectIMAP;
