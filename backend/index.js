const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.listen(PORT);

const cors = require('cors');
app.use(
    cors({
        origin: process.env.CLIENT_URL,
    })
);
app.use(express.json());

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
);

app.post('/auth/google', async (req, res) => {
    oAuth2Client.setCredentials({access_token: req.body.token});
    res.sendStatus(200);
});

app.use('/create-event', async (req, res) => {
    const { currentTitle, startTimeDate, endTimeDate } = await req.body;
    const calendar = google.calendar('v3');
    await calendar.events.insert({
    auth: oAuth2Client,
    calendarId: 'primary',
    requestBody: {
      summary: currentTitle,
      colorId: "3",
      start: {
        dateTime: startTimeDate,
      },
      end: {
        dateTime: endTimeDate,
      }
          }
            }).catch((error) => {
              console.error(error);
            });
    res.sendStatus(200);
});