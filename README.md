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
npm run cy:open
```

To run the tests headlessly and have them report results to the console, it's:

```
npm run cy:run
```

Both of the above assume that the development server is running, so be sure to start that first. Alternatively, `npm run test:e2e:ci` will start the dev server, run the test suite, and shut the server down afterward all in one command.

### Accessibility Scanning

The CI pipeline includes multiple accessibility checks, including [`axe-core`](https://github.com/dequelabs/axe-core) and [`HTML_CodeSniffer`](https://squizlabs.github.io/HTML_CodeSniffer/) as part of [`pa11y-ci`](https://github.com/pa11y/pa11y-ci), and the [Lighthouse accessibility audit](https://web.dev/lighthouse-accessibility/). While automated testing is not a substitute for manual accessibility auditing, these three tools together provide solid coverage of §508 requirements and WCAG 2.1/2.2 guidelines.

Lighthouse runs as part of the Cypress test suite, but to run the `pa11y-ci` scan locally, just run:

```
npm run pa11y:ci
```

## Linting & Styling

This project uses [Prettier](https://prettier.io/), [eslint](https://eslint.org/), and [stylelint](https://stylelint.io/) to ensure code is correct and formatted consistently. Git will run these tools automatically before applying a commit, but you should install the editor plugins for each tool to apply formatting and lint your code automatically.
