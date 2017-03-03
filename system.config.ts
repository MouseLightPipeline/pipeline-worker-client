const configurations: any = {
    development: {
        port: 4001,
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    },
    test: {
        port: 4001,
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    },
    staging: {
        port: 4051,
        apiPort: 3051,
        graphQlEndpoint: "/graphql",
    },
    production: {
        port: 4001,
        apiPort: 3001,
        graphQlEndpoint: "/graphql",
    }
};

export default function () {
    let env = process.env.NODE_ENV || "development";

    let config = configurations[env];

    config.port = process.env.WORKER_CLIENT_PORT ||config.port;
    config.apiPort = process.env.WORKER_API_PORT ||config.apiPort;

    return config;
}
