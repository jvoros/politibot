FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install node_modules
COPY package.json .
RUN npm install

# Mount manually upload files
VOLUME /wordvectors

# Bundle app source
COPY . .

# frontail port
EXPOSE 9001

# Run app
CMD [ "npm", "start" ]