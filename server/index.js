// index.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai'); // If integrating with OpenAI/DeepSeek

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3001;

// DeepSeek API
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: 'deepseek-chat',
    temperature: 1.3,
  });

// Initialize the bot with polling
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();

  console.log(userId);
  console.log(process.env.MY_ID);

  // Check if the user is allowed
  if (userId !== process.env.MY_ID && userId !== process.env.MUM_ID && userId !== process.env.DAD_ID) {  
    return bot.sendMessage(chatId, 'You are not allowed to use this bot.');
  }
  
  const text = msg.text;
  // OpenAI/DeepSeek
  try {
    const aiResponse = await getAIResponse(text);
    bot.sendMessage(chatId, aiResponse);
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(chatId, 'Sorry, something went wrong.');
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

// Root endpoint (optional)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Telegram Bot is running with Long Polling.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
