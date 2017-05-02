import * as React from "react";
import {Table, Button, Glyphicon, ButtonToolbar} from "react-bootstrap"
import gql from "graphql-tag";
import {graphql} from "react-apollo";
import * as moment from "moment";

import {ITaskExecution, ExecutionStatusCode, CompletionStatusCode, ExecutionStatus} from "./QueryInterfaces";
import {formatCpuUsage, formatMemoryFromMB, formatValue, formatDurationFromHours} from "./util/formatters";

interface IExecutedTaskRowProps {
    executedTask: ITaskExecution;
}

const ClearCompletedExecutionsMutation = gql`
  mutation removeCompletedExecutionsWithCode($code: Int) {
    removeCompletedExecutionsWithCode(code: $code)
  }
`;

class RemoveCompleteSuccessButton extends React.Component<any, any> {
    onClick = () => {
        this.props.removeSuccessMutation(CompletionStatusCode.Success)
        .then((count: any) => {
            console.log(`Deleted ${count} items`);
        }).catch((error: any) => {
            console.log("there was an error clearing completed executions", error);
        });
    };

    render() {
        return (<Button bsSize="sm" onClick={this.onClick}><Glyphicon glyph="trash"/>&nbsp;
            Clear Success</Button>)
    }
}

const RemoveCompleteSuccessButtonWithQuery = graphql(ClearCompletedExecutionsMutation, {
    props: ({mutate}) => ({
        removeSuccessMutation: (code: number) => mutate({
            variables: {
                code: code
            }
        })
    })
})(RemoveCompleteSuccessButton);

class RemoveCompleteErrorButton extends React.Component<any, any> {
    onClick = () => {
        this.props.removeErrorMutation(CompletionStatusCode.Error)
        .then((count: any) => {
            console.log(`Deleted ${count} items`);
        }).catch((error: any) => {
            console.log("there was an error clearing completed executions", error);
        });
    };

    render() {
        return (<Button bsSize="sm" onClick={this.onClick}><Glyphicon glyph="trash"/>&nbsp;
            Clear Errors</Button>)
    }
}

const RemoveCompleteErrorButtonWithQuery = graphql(ClearCompletedExecutionsMutation, {
    props: ({mutate}) => ({
        removeErrorMutation: (code: number) => mutate({
            variables: {
                code: code
            }
        })
    })
})(RemoveCompleteErrorButton);

class ExecutedTaskRow extends React.Component<IExecutedTaskRowProps, any> {
    render() {
        let executedTask = this.props.executedTask;

        let taskDefinition = executedTask ? executedTask.task : null;

        let durationText = "N/A";

        if (executedTask.started_at !== null) {
            let started_at = new Date(parseInt(executedTask.started_at));

            let completed_at = new Date();

            if (executedTask.completed_at !== null) {
                completed_at = new Date(parseInt(executedTask.completed_at));
            }

            let completed = moment(completed_at);
            let delta = completed.diff(moment(started_at));
            let duration = moment.duration(delta);

            durationText = formatDurationFromHours(duration.asMilliseconds() / 1000 / 3600);
        }

        let exitCodeText = (executedTask.completed_at !== null) ? executedTask.exit_code : "N/A";

        const parts = executedTask.resolved_args.split(",");

        let relativeTile = "(can't parse)";

        if (parts.length > 4) {
            relativeTile = parts[4];
        }

        let style = {};

        if (executedTask.completion_status_code === CompletionStatusCode.Error) {
            style = {color: "red"};
        } else if (executedTask.execution_status_code === ExecutionStatusCode.Running) {
            style = {color: "green"};
        }

        return (
            <tr>
                <td style={style}>{taskDefinition ? taskDefinition.name : executedTask.resolved_script}</td>
                <td style={style}>{relativeTile}</td>
                <td style={style}>{ExecutionStatusCode[executedTask.execution_status_code]}</td>
                <td style={style}>{ExecutionStatus[executedTask.last_process_status_code]}</td>
                <td style={style}>{`${CompletionStatusCode[executedTask.completion_status_code]} (${exitCodeText})`}</td>
                <td style={style}>{durationText}</td>
                <td style={style}
                    className="text-right">{`${formatCpuUsage(executedTask.max_cpu)} | ${formatMemoryFromMB(executedTask.max_memory)}`}</td>
                <td style={style} className="text-center">{formatValue(executedTask.work_units, 0)}</td>
            </tr>);
    }
}

interface IExecutedTasksTable {
    executedTasks: ITaskExecution[];
}

export class ExecutedTasksTable extends React.Component<IExecutedTasksTable, any> {
    render() {
        let rows = this.props.executedTasks.map(executedTask => {
               return (<ExecutedTaskRow key={"tr_" + executedTask.id} executedTask={executedTask}/>);
        });

        return (
            <div>
                <ButtonToolbar>
                    <RemoveCompleteSuccessButtonWithQuery/>
                    <RemoveCompleteErrorButtonWithQuery/>
                </ButtonToolbar>

                <Table striped condensed>
                    <thead>
                    <tr>
                        <th>Task</th>
                        <th>Tile</th>
                        <th>Status</th>
                        <th>PM Status</th>
                        <th>Exit Result (Code)</th>
                        <th>Duration</th>
                        <th className="text-right">Max<br/> CPU | Memory</th>
                        <th className="text-center">Work Units</th>
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
