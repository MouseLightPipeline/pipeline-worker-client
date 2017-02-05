"use strict";
var configurations = {
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
function default_1() {
    var env = process.env.NODE_ENV || "development";
    return configurations[env];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
