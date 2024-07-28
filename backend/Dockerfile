FROM node:18-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN npm install -g typescript pm2

COPY . .

RUN npm run build

EXPOSE 3001

COPY bin/db-wait.sh /db-wait.sh
COPY bin/create-database.sh /create-database.sh
COPY bin/docker-start.sh /docker-start.sh
RUN chmod +x /db-wait.sh /create-database.sh /docker-start.sh

CMD ["./docker-start.sh"]
