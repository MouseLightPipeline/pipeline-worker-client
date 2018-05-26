import * as React from "react";
import {graphql} from "react-apollo";
import {PageHeader} from "react-bootstrap";

import {
    RunningTasksWithQuery, TaskStatisticsWithQuery, WorkerQuery
} from "./GraphQLComponents";
import {ExecutedTasks} from "./ExecutedTasks";
import {Loading} from "./Loading";

class _Layout extends React.Component<any, any> {
    public render() {
        const {loading, error} = this.props.data;

        if (loading) {
            return <Loading/>
        }

        const worker = this.props.data && !this.props.data.loading ? this.props.data.worker : null;

        let modifier = "";

        if (worker && worker.is_cluster_proxy) {
            modifier = " (cluster proxy)";
        }

        let divStyle = {
            margin: "20px"
        };

        return (
            <div style={divStyle}>
                <PageHeader>Mouse Light Acquisition Dashboard
                    <small>Pipeline Worker{modifier}{worker ? ` pid: ${worker.process_id}` : ""}</small>
                </PageHeader>
                <RunningTasksWithQuery worker={worker}/>
                <TaskStatisticsWithQuery/>
                <ExecutedTasks/>
            </div>
        );
    }
}

export const Layout = graphql(WorkerQuery, {
    options: {pollInterval: 5 * 1000}
})(_Layout);
