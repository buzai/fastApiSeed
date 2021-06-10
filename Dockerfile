FROM node:15-alpine

RUN mkdir -p /home/project
RUN mkdir -p /home/project/upload

WORKDIR /home/project

COPY package*.json ./
RUN cat package.json

RUN node -v
RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "app.js"]
