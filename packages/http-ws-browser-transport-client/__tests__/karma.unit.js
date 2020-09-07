import * as karma from "karma";
const path = require("path");
const webpackConfig = require("./webpack.config");
process.env.CHROME_BIN = require('puppeteer').executablePath()

/**
 * 
 * @param {karma.Config} config 
 */
module.exports = function(config) {
    config.set({
        basePath: path.resolve(__dirname),
        frameworks: ["mocha", "chai"],
        files: ["**/*.test.ts"],
        exclude: [],
        preprocessors: {
            "**/*.test.ts": "webpack"
        },
        //@ts-ignore
        webpack: webpackConfig,
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ["ChromeHeadless"],
        singleRun: false,
        concurrency: Infinity
    });
};