# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) from the current directory into the working directory
COPY package*.json ./

# Copy the rest of the application code into the working directory
COPY . .

# Install any needed packages
RUN npm install

# Expose port 5000
EXPOSE 5000

# Start the application
CMD [ "npm", "start" ]