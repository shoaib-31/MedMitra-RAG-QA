FROM node:21-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL "$NEXT_PUBLIC_SERVER_URL"


COPY . .


RUN npm run build

CMD ["npm", "run", "start"]
