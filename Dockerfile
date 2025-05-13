FROM node:18
WORKDIR /MyProject
COPY . .
CMD ["node", "index.js"]