# frontend/Dockerfile

# Use the official Node.js image as a base
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package*.json /app/

# Install the dependencies
RUN npm install

# Copy the entire frontend directory to the container
COPY . /app/

# Expose port 3000 for the React server
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
