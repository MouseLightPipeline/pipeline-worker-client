import * as React from "react";
import {PageHeader} from "react-bootstrap";

import {TaskDefinitionsWithQuery, RunningTasksWithQuery} from "./GraphQLComponents";

export function Layout() {
    let divStyle = {
        margin: "20px"
    };

    return (
        <div style={divStyle}>
            <PageHeader>Mouse Light Acquisition Dashboard
                <small> Pipeline Worker</small>
            </PageHeader>
            <TaskDefinitionsWithQuery/>
            <RunningTasksWithQuery/>
        </div>
    )
}
