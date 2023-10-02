FROM node:18-alpine3.17
RUN mkdir -p /home/node/app/node_modules \
    && chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node package*.json ./
RUN npm i
COPY --chown=node:node . .
CMD [ "node", "bot.js" ]