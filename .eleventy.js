const textInput = require('./src/components/text-input');

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode('textInput', textInput);

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
