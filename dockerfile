FROM node:14-alpine

WORKDIR /apis
RUN chown -R node:node /apis
USER node

COPY package.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "start"]
