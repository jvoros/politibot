FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Move the word library
COPY wordvectors/ wordvectors/

# Install node_modules
COPY package.json .
ENV NODE_ENV production
RUN npm install

# Bundle app source
COPY . .

# frontail port
EXPOSE 9001

# Run app
CMD [ "npm", "start" ]