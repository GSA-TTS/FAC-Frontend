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

## Testing

To run the end-to-end test suite in a browser, run

```
npm run test:cy:open
```

For to run the tests headlessly and have them report results to the console, it's:

```
npm run test:cy:run
```

Both of the above assume that the development server is running, so be sure to start that first. Alternatively, `npm run test:e2e:ci` will start the dev server, run the test suite, and shut the server down afterward all in one command.
