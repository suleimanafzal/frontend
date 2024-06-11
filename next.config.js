const path = require('path');

module.exports = {
  webpack: (config) => {
    // Custom alias
    config.resolve.alias['@src'] = path.join(__dirname, 'src');
    return config;
  },
  pageExtensions: ['js', 'jsx'],  // Allow custom extensions
  reactStrictMode: true,
};
