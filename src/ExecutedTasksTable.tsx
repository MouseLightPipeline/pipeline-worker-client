import * as React from "react";
import {Table, Button, Glyphicon} from "react-bootstrap"
import * as moment from "moment";

import {
    IExecutedTask, ITaskDefinition, ExecutionStatusCode, CompletionStatusCode,
    ExecutionStatus
} from "./QueryInterfaces";

interface IExecutedTaskRowProps {
    executedTask: IExecutedTask;
    taskDefinition: ITaskDefinition;
}

class ClearCompletedButton extends React.Component<any, any> {
    onClick = () => {
        this.props.clearComplete();
    };

    render() {
        return (<Button bsStyle="warning" bsSize="sm" onClick={this.onClick}><Glyphicon glyph="trash"/>
            Clear Complete</Button>)
    }
}

class ExecutedTaskRow extends React.Component<IExecutedTaskRowProps, any> {
    render() {
        let executedTask = this.props.executedTask;

        let taskDefinition = this.props.taskDefinition;

        let durationText = "N/A";

        if (executedTask.completed_at !== null && executedTask.started_at !== null) {
            let completed_at = new Date(parseInt(executedTask.completed_at));
            let started_at = new Date(parseInt(executedTask.started_at));

            let completed = moment(completed_at);
            let delta = completed.diff(moment(started_at));
            let duration = moment.duration(delta);

            durationText = duration.asSeconds() > 119 ? `${(delta / 60000).toFixed(1)} minutes` : `${(delta / 1000).toFixed(1)} seconds`;
        }

        let exitCodeText = (executedTask.completed_at !== null) ? executedTask.exit_code : "N/A";

        const parts = executedTask.resolved_args.split(",");

        let relativeTile = "(can't parse)";

        if (parts.length > 4) {
            relativeTile = parts[4];
        }

        return (
            <tr>
                <td>{taskDefinition ? taskDefinition.name : executedTask.resolved_script}</td>
                <td>{relativeTile}</td>
                <td>{ExecutionStatusCode[executedTask.execution_status_code]}</td>
                <td>{ExecutionStatus[executedTask.last_process_status_code]}</td>
                <td>{`${CompletionStatusCode[executedTask.completion_status_code]} (${exitCodeText})`}</td>
                <td>{durationText}</td>
                <td>{`${executedTask.max_cpu ? executedTask.max_cpu.toFixed(2) : "N/A"} | ${(executedTask.max_memory ? executedTask.max_memory.toFixed(2) : "N/A")}`}</td>
                <td>{executedTask.work_units.toFixed(2)}</td>
            </tr>);
    }
}

interface IExecutedTasksTable {
    executedTasks: IExecutedTask[];
    taskDefinitions: ITaskDefinition[];
    clearComplete();
}

export class ExecutedTasksTable extends React.Component<IExecutedTasksTable, any> {
    render() {
        let rows = this.props.executedTasks.map(executedTask => {
            let t = this.props.taskDefinitions.filter(task => task.id === executedTask.task_id);
            let s = t.length ? t[0] : null;
            return (
                <ExecutedTaskRow key={"tr_" + executedTask.id} taskDefinition={s} executedTask={executedTask}/>)
        });

        return (
            <div>
                <ClearCompletedButton clearComplete={this.props.clearComplete}/>
                <Table striped condensed>
                    <thead>
                    <tr>
                        <td>Script</td>
                        <td>Tile</td>
                        <td>Status</td>
                        <td>PM Status</td>
                        <td>Exit Result (Code)</td>
                        <td>Duration</td>
                        <td>Max CPU (%) | Mem (MB)</td>
                        <td>Work Units</td>
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
