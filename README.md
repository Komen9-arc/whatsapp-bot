WhatsApp Bot (Cloud API + Node.js)
Setup
Create a Meta app at developers.facebook.com and add the WhatsApp product.
Copy the temporary access token and Phone number ID from WhatsApp > API Setup.
Copy .env.example to .env and fill in the values.
npm install then npm start.
Deploy (Render / Railway / Fly.io)
Push this repo to GitHub.
Create a new Web Service from the repo.
Build command: npm install
Start command: npm start
Add VERIFY_TOKEN, WHATSAPP_TOKEN, PHONE_NUMBER_ID as environment variables.
Connect the webhook
In Meta dashboard > WhatsApp > Configuration:
Callback URL: https://YOUR-APP-URL/webhook
Verify token: the same value as VERIFY_TOKEN
Subscribe to the messages field.
Test
Add your own number as a test recipient in API Setup, then message the test number.
Notes
The temporary token expires in ~24h. For production, create a System User permanent token.
Never commit .env.
