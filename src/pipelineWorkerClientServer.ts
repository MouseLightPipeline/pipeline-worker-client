import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";

const config = require("./../webpack.config.js");

import {Configuration} from "./configuration";

const PORT = process.env.API_CLIENT_PORT || Configuration.port;

const localUri = `http://${Configuration.host}:${Configuration.port}`;
const apiUri = `http://${Configuration.apiHostname}:${Configuration.apiPort}`;

new WebpackDevServer(webpack(config), {
    stats: {
        colors: true
    },
    proxy: {
        "/graphql": {
            target: apiUri
        }
    },
    disableHostCheck: true,
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    noInfo: false, quiet: false

}).listen(PORT, "0.0.0.0", (err: any) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Listening at ${localUri}`);
    console.log(`\t with graphql proxy to ${apiUri}`)
});
