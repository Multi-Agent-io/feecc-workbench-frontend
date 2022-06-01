FROM node:14-alpine
RUN mkdir -p /home/feecc-hub-frontend
WORKDIR /home/feecc-hub-frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=12 \
    CMD curl --fail http://localhost:3000 || exit 1
ENTRYPOINT [ "node", "nodeServer.js" ]
