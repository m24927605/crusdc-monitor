FROM node:14.9.0-alpine

# update packages
RUN apk update

# create application folder
WORKDIR /usr/app

# copy configs to /app folder
COPY .env ./
COPY package*.json ./
COPY tsconfig.json ./

# copy source code to /app/src folder
COPY src /usr/app/src

# check files list
RUN ls -a

RUN npm ci && npm i typescript -g
RUN npm run build
CMD ["node", "./dist/main.js"]