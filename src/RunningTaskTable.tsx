import * as path from "path";
import * as React from "react";
import {Table, Button, Glyphicon} from "react-bootstrap"
import moment = require("moment");

import {IRunningTask} from "./QueryInterfaces";
import {formatMemoryFromMB, formatCpuUsage, formatDurationFromHours} from "./util/formatters";

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

        const elapsed = moment().diff(moment(new Date(parseInt(runningTask.started_at))));

        const elapsedText = formatDurationFromHours(moment.duration(elapsed).asMilliseconds() / 1000 / 3600);

        const parts = runningTask.resolved_args.split(",");

        let relativeTile = "(can't parse)";

        if (parts.length > 4) {
            relativeTile = parts[4];
        }

        const taskName = runningTask && runningTask.task ? runningTask.task.name : "(unknown)";

        return (
            <tr>
                <td><Button bsSize="xs" bsStyle="danger" onClick={this.onCancelClick}><Glyphicon glyph="stop"/> Cancel</Button></td>
                <td>{new Date(parseInt(runningTask.started_at)).toLocaleString()}</td>
                <td>{elapsedText}</td>
                <td>{taskName}</td>
                <td>{relativeTile} </td>
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
        let rows = this.props.runningTasks.map(runningTask => (<RunningTaskRow key={"tr_r" + runningTask.id} runningTask={runningTask} onCancelTask={this.props.onCancelTask}/>));

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
