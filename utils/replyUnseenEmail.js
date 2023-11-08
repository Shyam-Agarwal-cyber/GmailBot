const {google} = require("googleapis")

const replyUnseenEmail = async (auth, message) => {
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
      format: "metadata",
      metadataHeaders: ["Subject", "From"],
    });
    const subject = res.data.payload.headers.find(
      (header) => header.name === "Subject"
    ).value;
    const from = res.data.payload.headers.find(
      (header) => header.name === "From"
    ).value;
    const replyTo = from.match(/<(.*)>/)[1];
    const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
    const replyBody = `Hi, \n\nThank you for your message. I'm currently on vacation and won't be checking my email regularly. I'll get back to you as soon as I'm back in the office. \n\nRegards, \Shyam Agarwal`;

    const rawMessage = [
      `From: me`,
      `To: ${replyTo}`,
      `Subject: ${replySubject}`,
      `In-Reply-To: ${message.id}`,
      `References: ${message.id}`,
      "",
      replyBody,
    ].join("\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
  }

  module.exports = replyUnseenEmail;