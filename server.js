require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const { VERIFY_TOKEN, WHATSAPP_TOKEN, PHONE_NUMBER_ID, PORT = 3000 } = process.env;
const API_URL = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;

// 1. Webhook verification (Meta calls this once when you set the webhook)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// 2. Incoming messages
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // acknowledge fast so Meta doesn't retry

  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];
    if (!message) return; // status updates, etc.

    const from = message.from;
    if (message.type !== "text") {
      return sendText(from, "Sorry, I only understand text messages for now.");
    }

    const reply = buildReply(message.text.body);
    await sendText(from, reply);
  } catch (err) {
    console.error("Webhook error:", err);
  }
});

// 3. Your bot logic: edit this
function buildReply(text) {
  const msg = text.trim().toLowerCase();
  if (msg === "hi" || msg === "hello") return "Hello! 👋 Type 'help' to see what I can do.";
  if (msg === "help") return "Commands:\n• hi\n• help\n• time\nAnything else, I'll echo back.";
  if (msg === "time") return `Server time: ${new Date().toISOString()}`;
  return `You said: ${text}`;
}

// 4. Send a reply via the WhatsApp Cloud API
async function sendText(to, body) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });
  if (!resp.ok) console.error("Send failed:", resp.status, await resp.text());
}

app.get("/", (_req, res) => res.send("WhatsApp bot is running."));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
