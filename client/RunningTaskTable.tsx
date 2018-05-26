import * as React from "react";
import {Table, Button, Glyphicon} from "react-bootstrap"
import moment = require("moment");

import {ExecutionStatus, IRunningTask} from "./QueryInterfaces";
import {formatMemoryFromMB, formatCpuUsage} from "./util/formatters";

interface IIRunningTaskRowProps {
    runningTask: IRunningTask;
    onCancelTask(id: string): void;
}

class RunningTaskRow extends React.Component<IIRunningTaskRowProps, any> {
    onCancelClick = () => {
        this.props.onCancelTask(this.props.runningTask.id);
    };

    render() {
        const runningTask = this.props.runningTask;

        const elapsed = runningTask.last_process_status_code === ExecutionStatus.Pending ?
            moment().diff(moment(new Date(runningTask.submitted_at))) :
            moment().diff(moment(new Date(runningTask.started_at)));

        const elapsedText = runningTask.last_process_status_code === ExecutionStatus.Pending ?
            `pending ${moment.duration(elapsed).humanize()}` :
            `${moment.duration(elapsed).humanize()}`;

        const taskName = runningTask.resolved_script; // runningTask && runningTask.task ? runningTask.task.name : "(unknown)";

        return (
            <tr>
                <td><Button bsSize="xs" bsStyle="danger" onClick={this.onCancelClick}><Glyphicon
                    glyph="stop"/> Cancel</Button></td>
                <td>{new Date(parseInt(runningTask.started_at)).toLocaleString()}</td>
                <td>{elapsedText}</td>
                <td>{taskName}</td>
                <td>{runningTask.tile_id} </td>
                <td>{runningTask.work_units} </td>
                <td>{formatCpuUsage(runningTask.max_cpu)}</td>
                <td>{formatMemoryFromMB(runningTask.max_memory)}</td>
            </tr>);
    }
}

interface IRunningTasksTable {
    runningTasks: IRunningTask[];
    onCancelTask(id: string): void;
}

export class RunningTasksTable extends React.Component<IRunningTasksTable, any> {
    render() {
        let rows = this.props.runningTasks.map(runningTask => (
            <RunningTaskRow key={"tr_r" + runningTask.id} runningTask={runningTask}
                            onCancelTask={this.props.onCancelTask}/>));

        return (
            <Table striped condensed>
                <thead>
                <tr>
                    <th/>
                    <th>Started</th>
                    <th>Elapsed</th>
                    <th>Script</th>
                    <th>Tile</th>
                    <th>Work Units</th>
                    <th>Max CPU</th>
                    <th>Max Memory</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}
