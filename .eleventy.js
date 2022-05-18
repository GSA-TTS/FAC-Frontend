const yaml = require('js-yaml');
require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy('assets/img');
  eleventyConfig.addPassthroughCopy('assets/js');
  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
