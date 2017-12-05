import * as React from "react";
import {ApolloProvider} from "react-apollo";
import ApolloClient from "apollo-client";
import {createNetworkInterface} from "apollo-client";

import {Layout} from "./Layout";

// If you use React Router, make this component render <Router> with your routes. Currently, only synchronous routes are
// hot reloaded, and you will see a warning from <Router> on every reload.  You can ignore this warning. For details,
// see: https://github.com/reactjs/react-router/issues/2182

declare var window: { __APOLLO_STATE__: any };

const networkInterface = createNetworkInterface({
    uri: "/graphql"
});

const client = new ApolloClient({
    networkInterface: networkInterface,
    dataIdFromObject: (result: any) => {
        if (result.id) {
            return result.id;
        }
        return null;
    },
    initialState: window.__APOLLO_STATE__
});

export class App extends React.Component<any, any> {
    render() {
        return (
            <ApolloProvider client={client}>
                <Layout/>
            </ApolloProvider>
        );
    }
}
