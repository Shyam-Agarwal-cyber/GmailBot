const { google } = require("googleapis");

const createLabel = async (auth) => {
    const gmail = google.gmail({ version: "v1", auth });

    try {
      const res = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: "Vacation",
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      return res.data.id;
    } catch (err) {
      if (err.code === 409) {
        // Label already exists
        const res = await gmail.users.labels.list({
          userId: "me",
        });
        const label = res.data.labels.find(
          (label) => label.name === "Vacation"
        );
        return label.id;
      } else {
        throw err;
      }
    }
  }

  module.exports = createLabel