const configurations: any = {
    production: {
        host: "",
        port: 6301,
        apiHostname: "pipeline-worker-api",
        apiPort: 6201,
        graphQlEndpoint: "/graphql",
    }
};

export const Configuration = LoadConfiguration();

function LoadConfiguration() {
    let config = configurations.production;

    config.port = process.env.PIPELINE_WORKER_CLIENT_PORT ||config.port;

    config.apiHostname = process.env.PIPELINE_WORKER_API_HOST||config.apiHostname;
    config.apiPort = process.env.PIPELINE_WORKER_API_PORT ||config.apiPort;

    return config;
}
