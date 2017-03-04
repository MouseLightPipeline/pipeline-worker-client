const configurations: any = {
    development: {
        apiHostname: "localhost",
        port: 4001,
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    },
    test: {
        apiHostname: "localhost",
        port: 4001,
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    },
    staging: {
        apiHostname: "localhost",
        port: 4051,
        apiPort: 3051,
        graphQlEndpoint: "/graphql",
    },
    production: {
        apiHostname: "localhost",
        port: 4001,
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    }
};

export default function () {
    let env = process.env.NODE_ENV || "development";

    let config = configurations[env];

    config.port = process.env.WORKER_CLIENT_PORT ||config.port;
    config.apiHostname = process.env.WORKER_API_HOST||config.apiHostname;
    config.apiPort = process.env.WORKER_API_PORT ||config.apiPort;

    return config;
}
