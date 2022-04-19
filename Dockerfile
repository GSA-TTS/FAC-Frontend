# See README for build/run instructions.
FROM node:17

WORKDIR /app
COPY package*.json /app
RUN npm install

EXPOSE 8080

# Run 11ty
# CMD ["npx", "@11ty/eleventy", "--serve", "--port=8080", "--input=src"]
WORKDIR /app
CMD ["npm", "run", "start"]
