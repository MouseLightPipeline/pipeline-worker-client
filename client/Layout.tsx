import * as React from "react";
import {graphql} from "react-apollo";
import {PageHeader} from "react-bootstrap";

import {WorkerQuery} from "./GraphQLComponents";
import {ExecutedTasks} from "./ExecutedTasks";
import {Loading} from "./Loading";
import {RunningTasksWithQuery} from "./RunningTasks";

class _Layout extends React.Component<any, any> {
    public render() {
        const {loading, error} = this.props.data;

        if (loading) {
            return <Loading/>
        }

        const worker = this.props.data && !this.props.data.loading ? this.props.data.worker : null;

        let divStyle = {
            margin: "20px"
        };

        return (
            <div style={divStyle}>
                <PageHeader>{worker.display_name}
                    <small>{worker ? ` PID: ${worker.process_id}` : ""}</small>
                </PageHeader>
                <RunningTasksWithQuery worker={worker}/>
                <ExecutedTasks/>
            </div>
        );
    }
}

export const Layout = graphql(WorkerQuery, {
    options: {pollInterval: 5 * 1000}
})(_Layout);
