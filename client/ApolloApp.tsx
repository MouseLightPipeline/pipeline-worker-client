import * as React from "react";

import ApolloClient from "apollo-boost";
import {ApolloProvider} from "react-apollo";

import {Layout} from "./Layout";

const client = new ApolloClient({
    uri: "/graphql",
});

export class ApolloApp extends React.Component<any, any> {
    render() {
        return (
            <ApolloProvider client={client}>
                <Layout/>
            </ApolloProvider>
        );
    }
}
