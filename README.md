# Federal Audit Clearinghouse Front-End

This repo contains the static front-end to the main [FAC app](https://github.com/GSA-TTS/FAC).

## Running locally

The site is built using [Eleventy](https://www.11ty.dev/), but all you need to get started running locally is `node` and `NPM`. After checking out the code in this repo, just:

```
npm install
```

to install the required dependencies. Then to run the site locally in development mode, just

```
npm run start
```

Finally, if you need to create a production build locally (perhaps for troubleshooting purposes), you can run

```
npm run build
```

## Using Docker

To build the container:

```
docker build -t fac/11ty .
```

To run the container on the local directory:

```
docker run -p 3000:3000 -p 3001:3001 -it -v ${PWD}/src:/app fac/11ty
```