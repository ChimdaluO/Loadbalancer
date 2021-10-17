FROM node:14.17.6
WORKDIR /www
COPY ./package.json ./package.json
RUN npm install

WORKDIR /www
COPY . .

WORKDIR /www
EXPOSE 80
EXPOSE 3001

CMD ["npm","start"]
