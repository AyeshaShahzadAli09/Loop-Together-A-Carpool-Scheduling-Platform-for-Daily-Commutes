FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all application code
COPY . .

# Expose ports for both frontend and backend
EXPOSE 3000
EXPOSE 5000

# Start both frontend and backend with the dev:all script
CMD ["npm", "run", "dev:all"] 