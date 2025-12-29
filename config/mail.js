// import { ImapFlow } from "imapflow";
const { ImapFlow } = require("imapflow");

module.exports = async function fetchInbox(email, password) {
  const client = new ImapFlow({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_IMAP_PORT,
    secure: false,
    auth: { user: email, pass: password },
    tls: { rejectUnauthorized: false }
  });

  await client.connect();
  await client.mailboxOpen("INBOX");

  const mails = [];
  for await (let msg of client.fetch("1:*", { envelope: true })) {
    mails.push({
      id: msg.uid,
      from: msg.envelope.from?.[0]?.address,
      subject: msg.envelope.subject,
      date: msg.envelope.date
    });
  }

  await client.logout();
  return mails.reverse();
}
