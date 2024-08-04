# Use a Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install build essentials for bcrypt
RUN apt-get update && apt-get install -y build-essential python3

# Install dependencies and rebuild bcrypt
RUN npm ci
RUN npm rebuild bcrypt --build-from-source

# Copy Prisma schema file
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 8800

# Start the application
CMD ["npm", "start"]