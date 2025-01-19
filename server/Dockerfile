# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install PM2 globally
RUN npm install -g pm2

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Define the command to run your app with PM2
CMD ["pm2-runtime", "index.js"]