FROM node:14
# ENV QBIT_HOST=http://localhost:48000
WORKDIR /usr/src/node-app
COPY . ./
RUN npm install
RUN npm run build
RUN npm run server-setup

EXPOSE 48001

CMD [ "npm", "run", "server-docker-start" ]
