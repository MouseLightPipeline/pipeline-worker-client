import * as React from "react";
import {PageHeader} from "react-bootstrap";

import {
    TaskDefinitionsWithQuery, RunningTasksWithQuery, TaskStatisticsWithQuery
} from "./GraphQLComponents";
import {ExecutedTasks} from "./ExecutedTasks";

export function Layout() {
    let divStyle = {
        margin: "20px"
    };

    return (
        <div style={divStyle}>
            <PageHeader>Mouse Light Acquisition Dashboard
                <small> Pipeline Worker</small>
            </PageHeader>
            <RunningTasksWithQuery/>
            <TaskStatisticsWithQuery/>
            <ExecutedTasks/>
            <TaskDefinitionsWithQuery/>
        </div>
    )
}
