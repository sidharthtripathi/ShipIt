FROM node:latest
WORKDIR /react-builder
RUN apt update -y
RUN apt install git -y
COPY index.js .
CMD [ "node" , "index.js" ]