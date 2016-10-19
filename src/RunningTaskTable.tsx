import * as React from "react";
import {Table} from "react-bootstrap"

import {IRunningTask} from "./QueryInterfaces";

interface IIRunningTaskRowProps {
    runningTask: IRunningTask;
}

class RunningTaskRow extends React.Component<IIRunningTaskRowProps, any> {
    render() {
        let runningTask = this.props.runningTask;

        return (
            <tr key={"tr_" + runningTask.id}>
                <td>{runningTask.resolved_script}</td>
                <td>{runningTask.max_cpu} %</td>
                <td>{(runningTask.max_memory  / 1024 / 1024).toFixed(2)}</td>
            </tr>);
    }
}

interface IRunningTasksTable {
    runningTasks: IRunningTask[];
}

export class RunningTasksTable extends React.Component<IRunningTasksTable, any> {
    render() {
        let rows = this.props.runningTasks.map(runningTask => (<RunningTaskRow runningTask={runningTask}/>));

        return (
            <Table striped condensed>
                <thead>
                <tr>
                    <td>Script</td>
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
