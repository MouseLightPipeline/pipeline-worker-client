const configurations: any = {
    development: {
        host: "localhost",
        port: 4001,
        apiHostname: "localhost",
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    },
    test: {
        host: "localhost",
        port: 4001,
        apiHostname: "localhost",
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    },
    staging: {
        host: "localhost",
        port: 4051,
        apiHostname: "localhost",
        apiPort: 3051,
        graphQlEndpoint: "/graphql",
    },
    production: {
        host: "localhost",
        port: 4001,
        apiHostname: "localhost",
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    }
};

export const Configuration = LoadConfiguration();

function LoadConfiguration() {
    let env = process.env.NODE_ENV || "development";

    let config = configurations[env];

    config.port = process.env.WORKER_CLIENT_PORT ||config.port;
    config.apiHostname = process.env.WORKER_API_HOST||config.apiHostname;
    config.apiPort = process.env.WORKER_API_PORT ||config.apiPort;

    return config;
}
