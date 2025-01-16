// Polling-based telegram bot version
require('dotenv').config();
const { Bot } = require('grammy');
const OpenAI = require('openai');

const prompt = "You are a helpful assistant.";

// DeepSeek API
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-chat',
  temperature: 1.3,
});

// Initialize the bot with polling
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);

// Handler
bot.on('message:text', async (ctx) => {
  try {
    await handleMessage(ctx.msg);
  } catch (error) {
    console.error('Error handling message:', error);
    await ctx.reply('Sorry, something went wrong.');
  }
});

// Async function to handle each incoming message
async function handleMessage(msg) {
  const userId = msg.from.id.toString();
  console.log(`Received message from User ID: ${userId}`);

  // Check if the user is allowed
  const authorizedUsers = process.env.AUTHORIZED_USERS?.split(',') || [];
  if (!authorizedUsers.includes(userId)) {
    await bot.api.sendMessage(userId, 'You are not allowed to use this bot.');
    return;
  }

  const text = msg.text;
  console.log(`Received message: ${text}`);

  // OpenAI/DeepSeek Integration
  try {
    const aiResponse = await getAIResponse(text);
    await bot.api.sendMessage(userId, aiResponse);
  } catch (error) {
    console.error('Error:', error);
    await bot.api.sendMessage(userId, 'Sorry, something went wrong.');
  }
}

// Function to get AI response from DeepSeek using OpenAI SDK
async function getAIResponse(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        { role: 'user', content: userMessage },
      ],
    });

    const aiText = completion.choices[0].message.content.trim();
    console.log(`AI Response: ${aiText}`);
    return aiText;
  } catch (error) {
    console.error(
      'Error communicating with DeepSeek:',
      error.response ? error.response.data : error.message
    );
    return 'Sorry, I encountered an error while processing your request.';
  }
}

// Start the bot
bot.start();
