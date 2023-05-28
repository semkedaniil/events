FROM node:16.13.1-alpine3.14

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json"]

RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 3000
# Runs the dev npm script to build & start the server
CMD ["npm", "run", "dev"]