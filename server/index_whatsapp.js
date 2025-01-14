require("dotenv").config();

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();

// DeepSeek API
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-chat',
  temperature: 1.3,
});

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verification endpoint
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);
      } else {
          res.sendStatus(403);
      }
  }
});

// Message handling endpoint
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
      body.entry.forEach(async (entry) => {
          const changes = entry.changes;
          changes.forEach(async (change) => {
              if (change.value.messages && change.value.messages.length > 0) {
                  const message = change.value.messages[0];
                  const from = message.from; // WhatsApp ID of the sender
                  // check valid from
                  if (from !== process.env.MY_TEL && from !== process.env.MUM_TEL && from !== process.env.DAD_TEL) {
                    return res.sendStatus(404);
                  }
                  const msgBody = message.text.body;

                  console.log(`Received message from ${from}: ${msgBody}`);

                  // Generate response using OpenAI
                  const aiResponse = await getAIResponse(msgBody);

                  if (aiResponse) {
                      // Send the response back to the user
                      await sendMessage(from, aiResponse);
                  }
              }
          });
      });

      res.sendStatus(200);
  } else {
      res.sendStatus(404);
  }
});

// Function to get AI response from DeepSeek using OpenAI SDK
async function getAIResponse(userMessage) {
  try {
      const completion = await openai.chat.completions.create({
          model: 'deepseek-chat', // Ensure this matches the model name provided by DeepSeek
          messages: [
              { role: 'system', content: 'You are a helpful assistant. Please answer my request in Traditional Chinese.' },
              { role: 'user', content: userMessage },
          ],
      });

      const aiText = completion.choices[0].message.content.trim();
      console.log(`AI Response: ${aiText}`);
      return aiText;
  } catch (error) {
      console.error('Error communicating with DeepSeek:', error.response ? error.response.data : error.message);
      return 'Sorry, I encountered an error while processing your request.';
  }
}

// Function to send message via WhatsApp Business API
async function sendMessage(to, message) {
  const url = `https://graph.facebook.com/v21.0/498816903323123/messages`;

  let payload = {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message },
  };

  try {
      const response = await axios.post(url, payload, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
          },
      });

      console.log('Message sent successfully:', response.data);
  } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
  }
}

// routes
app.get("/", (req, res) => {
  res.send("WhatsApp Chatbot is running.");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});