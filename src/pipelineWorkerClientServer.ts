import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";

const config = require("./../webpack.config.js");

const serverConfig = require("../system.config").default();

const localUri = `http://localhost:${serverConfig.port}`;
const apiUri = `http://${serverConfig.apiHostname}:${serverConfig.apiPort}`;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    proxy: {"/graphql": apiUri},
    historyApiFallback: true,
    noInfo: false,
    quiet: false
}).listen(serverConfig.port, "0.0.0.0", (err: any) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Listening at ${localUri}/`);
    console.log(`\t with graphql proxy to ${apiUri}`)
});
