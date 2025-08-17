const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
    prependData: `@import "styles/variables"; @import "styles/fonts";`,
  },
};

module.exports = nextConfig;

