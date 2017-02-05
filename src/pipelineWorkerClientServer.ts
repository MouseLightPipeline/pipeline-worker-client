import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";

const config = require("./../webpack.config.js");

const serverConfig = require("../system.config").default();

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    proxy: {"/graphql": `http://localhost:${serverConfig.apiPort}`},
    historyApiFallback: true,
    noInfo: false,
    quiet: false
}).listen(serverConfig.port, "0.0.0.0", function (err, result) {
    if (err) {
        return console.log(err);
    }

    console.log(`Listening at http://localhost:${serverConfig.port}/`);
});
