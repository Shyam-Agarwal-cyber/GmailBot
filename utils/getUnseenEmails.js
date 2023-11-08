const { google } = require("googleapis")

const getUnseenEmails = async (auth)=>{
    const gmail = google.gmail({ version: "v1", auth });
    const res = await gmail.users.messages.list({
      userId: "me",
      q: "-in:chats -from:me -has:userlabels",
    });
    return res.data.messages || [];
}

module.exports = getUnseenEmails;