process.env.NODE_ENV = process.env.NODE_ENV || "development";

const paths = require("./utils/paths");
const overrides = require('../config-overrides');
const webpackConfigPath = paths.scriptVersion + "/config/webpack.config.dev";
const devServerConfigPath = paths.scriptVersion + "/config/webpackDevServer.config.js";

// load original configs
const webpackConfig = require(webpackConfigPath);
const devServerConfig = require(devServerConfigPath);
// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports =
  overrides.webpack(webpackConfig, process.env.NODE_ENV);

// we may wish to defer the start process while we wait for the dev-server config to be created, so use
// Promise.resolve to enable `overrides.devServer` to return a Promise for the config if desired.
const devServerOverrides = overrides.devServer(devServerConfig, process.env.NODE_ENV);
Promise.resolve(devServerOverrides)
    .then((devServerOverrides) => {
        require.cache[require.resolve(devServerConfigPath)].exports =

        // run original script
        require(paths.scriptVersion + "/scripts/start");
    });
