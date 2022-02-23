// require the fs module that's built into Node.js
const fs = require('fs')
// get the raw data from the db.json file
let raw = fs.readFileSync('db.json');
// parse the raw bytes from the file as JSON
let faqs= JSON.parse(raw)

const { App } = require("@slack/bolt");
require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

// app.command("/knowledge", async ({ command, ack, say }) => {
//     try {
//       await ack();
//       say("Yaaay! that command works!");
//     } catch (error) {
//         console.log("err")
//       console.error(error);
//     }
// });

app.command("/knowledge", async ({ command, ack, say }) => {
    try {
      await ack();
      let message = { blocks: [] };
      faqs.data.map((faq) => {
        message.blocks.push(
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Question*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.question,
            },
          },
          {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*Answer*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: faq.answer,
              },
            }
        );
      });
      say(message);
    } catch (error) {
      console.log("err");
      console.error(error);
    }
  });

// matches any string that contains the string hey
app.message(/hey/, async ({ command, say }) => {
    try {
      say("Yaaay! that command works!");
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();