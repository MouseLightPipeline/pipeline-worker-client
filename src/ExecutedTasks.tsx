import * as React from "react";
import {Panel} from "react-bootstrap"

import {ExecutedTasksTable} from "./ExecutedTasksTable";
import {Loading} from "./Loading";

export class ExecutedTasks extends React.Component<any, any> {
    onClearComplete = () =>  {
        this.props.clearCompletedExecutions()
        .then((count) => {
            console.log(`Deleted ${count} items`);
        }).catch((error) => {
            console.log("there was an error clearing completed executions", error);
        });
    };

    render() {
        let executedTasks = [];

        if (this.props.data && this.props.data.taskExecutions) {
            executedTasks = this.props.data.taskExecutions;
        }

        let taskDefinitions = [];

        if (this.props.taskDefinitionsData && this.props.taskDefinitionsData.taskDefinitions) {
            taskDefinitions = this.props.taskDefinitionsData.taskDefinitions;
        }

        return (
            <div>
                {this.props.data.loading ? <Loading/> : <TablePanel taskDefinitions={taskDefinitions} executedTasks={executedTasks} clearComplete={this.onClearComplete}/>}
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Panel collapsible defaultExpanded header="Task Executions" bsStyle="primary">
                    {this.props.executedTasks.length === 0 ? <NoTasks/> :
                        <ExecutedTasksTable taskDefinitions={this.props.taskDefinitions} executedTasks={this.props.executedTasks} clearComplete={this.props.clearComplete}/> }
                </Panel>
            </div>
        );
    }
}

class NoTasks extends React.Component<any, any> {
    render() {
        return (
            <div>
                There are no task executions.
            </div>);
    }
}