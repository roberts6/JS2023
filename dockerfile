FROM node

WORKDIR /app

COPY  package.json /app/

RUN npm install 

EXPOSE 8080

CMD [ "node","src/app.js" ]