const { authenticate } = require("@google-cloud/local-auth");
const express = require("express");
const app = express();
const port = 7000;
const path = require("path");
const { google } = require("googleapis")
const getUnseenEmails = require("./utils/getUnseenEmails");
const replyUnseenEmail = require("./utils/replyUnseenEmail");
const createLabel = require("./utils/createLabel");
const addLabel = require("./utils/addLabel");

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];

app.get("/", async (reg, res) => {
  // Load client secrets from a local file.
  // const credentials = await fs.readFile("credentials.json");

  // Authorize a client with credentials, then call the Gmail API.
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "credentials.json"),
    scopes: SCOPES,
  });

  console.log("Authentication = ", auth);

  const gmail = google.gmail({ version: "v1", auth });

  const response = await gmail.users.labels.list({
    userId: "me",
  });

  const LABEL_NAME = "Vacation";

  // Main Function
  async function main() {
    // Create a label for the app
    const labelId = await createLabel(auth);

    setInterval(async () => {
      const unseenMessages = await getUnseenEmails(auth);
      console.log(`You have ${unseenMessages.length} unseen emails`);

      for (const message of unseenMessages) {
        await replyUnseenEmail(auth, message);
        console.log(`I sent the reply to message with id -->  ${message.id}`);

        await addLabel(auth, message, labelId);
        console.log(
          `I have added label to message with id --> ${message.id}. Please check later after your vacation is over!`
        );
      }
    }, 10000);
  }

  main().catch(console.error);

  const labels = response.data.labels;
  res.send("You have successfully subscribed to our services.");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});