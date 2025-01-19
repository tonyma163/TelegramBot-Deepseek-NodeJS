# Telegram Bot with DeepSeek Integration

A Telegram bot that integrates with DeepSeek's AI API to provide conversational responses. Built with Node.js and the Grammy framework.

## Features
- AI-powered responses using DeepSeek
- User authorization system
- Production-ready with PM2 process manager
- Docker support
- Customizable system prompt

## Setup

1. Clone the repository
2. Install dependencies:
```bash
cd server
npm install
```
3. Create a `.env` file with the following variables:
```
BOT_TOKEN=your_telegram_bot_token
DEEPSEEK_API_KEY=your_deepseek_api_key
AUTHORIZED_USERS=comma_separated_user_ids
```

## Customizing the System Prompt

You can modify the bot's behavior by editing the system prompt in `index.js`. Look for this section:

```javascript
// Polling-based telegram bot version
require('dotenv').config();
const { Bot } = require('grammy');
const OpenAI = require('openai');

const prompt = "You are a helpful assistant."; < - - Your prompt
```

Change the `prompt` property to customize the bot's personality and response style. For example:

```javascript
prompt: 'You are a sarcastic assistant who answers questions with witty remarks.'
```

## Running the Bot

### Development
```bash
npm run dev
```

### Production
```bash
npm run start:prod
```

## Deployment with PM2

The project includes a PM2 ecosystem configuration for production deployment. To start:
```bash
pm2 start ecosystem.config.js
```

## Development Tools

- ESLint for code linting
- Prettier for code formatting

Run linting and formatting:
```bash
npm run lint
npm run format
```

## Docker Support

Pull the pre-built Docker image:
```bash
docker pull tonyma163/tgbot-deepseek:v1.0
```

Build and run the Docker container:
```bash
docker build -t telegram-bot .
docker run -p 3001:3001 telegram-bot
```

## File Structure

```
server/
├── .env
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── Dockerfile
├── ecosystem.config.js
├── index.js
├── package.json
└── package-lock.json
```

## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
