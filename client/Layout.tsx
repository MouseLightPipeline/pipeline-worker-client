import * as React from "react";
import {graphql} from "react-apollo";
import {Alert, PageHeader} from "react-bootstrap";

import {WorkerQuery} from "./GraphQLComponents";
import {ExecutedTasks} from "./ExecutedTasks";
import {Loading} from "./Loading";
import {RunningTasksWithQuery} from "./RunningTasks";

class _Layout extends React.Component<any, any> {
    public constructor(props: any) {
        super(props);

        this.state = {
            hasError: false
        }
    }

    public render() {
        const {loading, error, networkStatus} = this.props.data;

        if (loading) {
            return <Loading/>
        }

        if (error) {
            return (
                <div style={{padding: "20px"}}>
                    <Alert bsStyle="danger">
                        <strong>{networkStatus === 8 ? "There is a problem connecting to the worker API process." : ""}</strong><br/>
                        {error.message}
                    </Alert>
                </div>
            );
        }

        const worker = this.props.data.worker;

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
    options: {pollInterval: 10 * 1000}
})(_Layout);
