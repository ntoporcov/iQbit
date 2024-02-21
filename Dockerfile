FROM node:14
ENV QBIT_HOST=http://localhost:8080
WORKDIR /usr/src/node-app
COPY . ./
RUN npm install
RUN npm run build
RUN npm run server-setup

EXPOSE 8081

CMD [ "npm", "run", "server-docker-start" ]
