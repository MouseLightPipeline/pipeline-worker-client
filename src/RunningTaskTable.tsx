import * as React from "react";
import {Table, Button, Glyphicon} from "react-bootstrap"
import moment = require("moment");

import {IRunningTask} from "./QueryInterfaces";

interface IIRunningTaskRowProps {
    runningTask: IRunningTask;
    onCancelTask(id: string);
}

class RunningTaskRow extends React.Component<IIRunningTaskRowProps, any> {
    onCancelClick = () => {
        this.props.onCancelTask(this.props.runningTask.id);
    };

    render() {
        let runningTask = this.props.runningTask;

        let elapsed = moment().diff(moment(new Date(parseInt(runningTask.started_at))));

        let elapsedText = elapsed < 120000 ? `${moment.duration(elapsed).asSeconds().toFixed(0)} seconds` : `${moment.duration(elapsed).asMinutes().toFixed(1)} minutes`;

        return (
            <tr>
                <td><Button bsSize="xs" bsStyle="danger" onClick={this.onCancelClick}><Glyphicon glyph="stop"/> Cancel</Button></td>
                <td>{new Date(parseInt(runningTask.started_at)).toLocaleString()}</td>
                <td>{elapsedText}</td>
                <td>{runningTask.resolved_script}</td>
                <td>{runningTask.work_units} </td>
                <td>{runningTask.max_cpu ? runningTask.max_cpu.toFixed(2) : "N/A"} %</td>
                <td>{runningTask.max_memory ? runningTask.max_memory.toFixed(2) : "N/A"}</td>
            </tr>);
    }
}

interface IRunningTasksTable {
    runningTasks: IRunningTask[];
    onCancelTask(id: string);
}

export class RunningTasksTable extends React.Component<IRunningTasksTable, any> {
    render() {
        let rows = this.props.runningTasks.map(runningTask => (<RunningTaskRow key={"tr_" + runningTask.id} runningTask={runningTask} onCancelTask={this.props.onCancelTask}/>));

        return (
            <Table striped condensed>
                <thead>
                <tr>
                    <td/>
                    <td>Started</td>
                    <td>Elapsed</td>
                    <td>Script</td>
                    <td>Work Units</td>
                    <td>Max CPU</td>
                    <td>Max Memory (MB)</td>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}
