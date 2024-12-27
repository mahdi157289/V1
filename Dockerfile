# Stage 1: Build the React App
FROM node:18 AS builder

# Set working directory for React client
WORKDIR /app/client

# Copy the package.json and package-lock.json (or yarn.lock) and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the React app source code
COPY client/ .

# Build the React app
RUN npm run build

# Stage 2: Set up the Node.js server
FROM node:18 AS server

# Set working directory for server
WORKDIR /app/server

# Copy the server package.json and install dependencies
COPY server/package*.json ./
RUN npm install

# Copy server source code
COPY server/ .

# Copy the built React app from the builder stage
COPY --from=builder /app/client/build /app/server/public

# Expose the port your server is running on
EXPOSE 5000

# Command to start the server
CMD ["node", "index.js"]

