FROM node:14-alpine
RUN mkdir -p /home/feecc-hub-frontend
WORKDIR /home/feecc-hub-frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "node", "nodeServer.js" ]
