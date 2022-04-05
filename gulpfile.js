const uswds = require('@uswds/compile');

/**
 * USWDS version
 */

uswds.settings.version = 3;

/**
 * Path settings
 */

uswds.paths.src.projectSass = './src/scss';
uswds.paths.dist.sass = './src/scss/uswds';
uswds.paths.dist.theme = './src/scss/uswds';

uswds.paths.dist.css = './_site/assets/css';
uswds.paths.dist.img = './_site/assets/img';
uswds.paths.dist.fonts = './_site/assets/fonts';
uswds.paths.dist.js = './_site/assets/js';

/**
 * Exports
 */

exports.init = uswds.init;
exports.compile = uswds.compile;
exports.watch = uswds.watch;
exports.update = uswds.updateUswds;
exports.default = uswds.watch;
