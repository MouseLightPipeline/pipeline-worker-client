import * as React from "react";
import {Table, Button, Glyphicon} from "react-bootstrap"

import {IExecutedTask} from "./QueryInterfaces";

interface IExecutedTaskRowProps {
    executedTask: IExecutedTask;
}

class ClearCompletedButton extends React.Component<any, any> {
    onClick = () => {
        this.props.clearComplete();
    };

    render() {
        return (<Button bsStyle="success" bsSize="sm" onClick={this.onClick}><Glyphicon glyph="remove"/> Clear Complete</Button>)
    }
}

class ExecutedTaskRow extends React.Component<IExecutedTaskRowProps, any> {
    render() {
        let executedTask = this.props.executedTask;

        return (
            <tr>
                <td>{executedTask.resolved_script}</td>
                <td>{executedTask.last_process_status_code}</td>
                <td>{executedTask.completion_status_code}</td>
                <td>{executedTask.execution_status_code}</td>
            </tr>);
    }
}

interface IExecutedTasksTable {
    executedTasks: IExecutedTask[];
    clearComplete();
}

export class ExecutedTasksTable extends React.Component<IExecutedTasksTable, any> {
    render() {
        let rows = this.props.executedTasks.map(executedTask => (
            <ExecutedTaskRow key={"tr_" + executedTask.id} executedTask={executedTask}/>));

        return (
            <div>
                <ClearCompletedButton clearComplete={this.props.clearComplete}/>
                <Table striped condensed>
                    <thead>
                    <tr>
                        <td>Script</td>
                        <td>Process</td>
                        <td>Completion</td>
                        <td>Execution</td>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </div>
        );
    }
}
