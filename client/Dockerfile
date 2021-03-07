# Base Image
FROM node:alpine

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "start"]
