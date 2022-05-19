const yaml = require('js-yaml');
const esbuild = require('esbuild');
const glob = require('glob');
const path = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');

require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy('assets/img');
  eleventyConfig.addPassthroughCopy('assets/js');

  const jsPath = glob.sync(path.join('.','src','js','*.js'));

  eleventyConfig.on('afterBuild', () => {
    return esbuild.build({
      entryPoints: [...jsPath, 'src/scss/main.scss'],
      outdir: '_site/assets',
      minify: process.env.ELEVENTY_ENV === "production",
      sourcemap: process.env.ELEVENTY_ENV !== "production",
      target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
      bundle: true,
      format: 'iife',
      loader: {
        '.png': 'dataurl',
        '.svg': 'dataurl',
        '.ttf': 'dataurl',
        '.woff': 'dataurl',
        '.woff2': 'dataurl',
      },
      plugins: [
        sassPlugin({
          loadPaths: [
            "./node_modules/@uswds",
            "./node_modules/@uswds/uswds/packages",
          ],
        }),
      ]
    });
  });

  eleventyConfig.addWatchTarget("./src/js/")
  eleventyConfig.addWatchTarget("./src/scss/")

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
