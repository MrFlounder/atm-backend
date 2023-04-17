# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Compile the TypeScript code
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Install netcat (nc)
RUN apt-get update && apt-get install -y netcat

# Start the application
CMD [ "node", "build/index.js" ]
