const yaml = require('js-yaml');
const esbuild = require('esbuild');
const glob = require('glob');
const path = require('path');

require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy('assets/img');
  const jsPath = glob.sync(path.join('src','js','*.js'));

  eleventyConfig.on('afterBuild', () => {
    return esbuild.build({
      entryPoints: jsPath,
      outdir: '_site/assets/js',
      minify: process.env.ELEVENTY_ENV === "production",
      sourcemap: process.env.ELEVENTY_ENV !== "production",
      target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
      bundle: true,
      format: 'iife'
    });
  });

  eleventyConfig.addWatchTarget("./js/")

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
