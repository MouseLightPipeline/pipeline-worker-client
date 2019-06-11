import * as React from "react";
import {Table, Button, Glyphicon, ButtonToolbar} from "react-bootstrap"
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import * as moment from "moment";

import {ITaskExecution, ExecutionStatusCode, CompletionStatusCode, ExecutionStatus} from "./QueryInterfaces";
import {formatCpuUsage, formatMemoryFromMB, formatValue, formatDurationFromHours} from "./util/formatters";

const REMOVE_COMPLETED_MUTATION = gql` 
    mutation removeCompletedExecutionsWithCode($code: Int) {
        removeCompletedExecutionsWithCode(code: $code)
}`;

type RemovedCompletedVariables = {
    code: number;
}

type RemovedCompletedData = {
    count: number
}

type RemovedCompletedMutationResponse = {
    removeCompletedExecutionsWithCode: RemovedCompletedData;
}

class RemovedCompletedMutation extends Mutation<RemovedCompletedMutationResponse, RemovedCompletedVariables> {
}

interface IExecutedTaskRowProps {
    executedTask: ITaskExecution;
}

class ExecutedTaskRow extends React.Component<IExecutedTaskRowProps, any> {
    render() {
        let executedTask = this.props.executedTask;

        let taskDefinition = executedTask ? executedTask.task : null;

        let durationText = "N/A";

        if (executedTask.started_at !== null) {
            let started_at = new Date(executedTask.started_at);

            let completed_at = new Date();

            if (executedTask.completed_at !== null) {
                completed_at = new Date(executedTask.completed_at);
            }

            let completed = moment(completed_at);
            let delta = completed.diff(moment(started_at));
            let duration = moment.duration(delta);

            durationText = formatDurationFromHours(duration.asMilliseconds() / 1000 / 3600);
        }

        let exitCodeText = (executedTask.completed_at !== null) ? executedTask.exit_code : "N/A";

        let style = {};

        if (executedTask.completion_status_code === CompletionStatusCode.Error) {
            style = {color: "red"};
        } else if (executedTask.execution_status_code === ExecutionStatusCode.Running) {
            style = {color: "green"};
        }

        return (
            <tr>
                <td style={style}>{taskDefinition ? taskDefinition.name : executedTask.resolved_script}</td>
                <td style={style}>{executedTask.tile_id}</td>
                <td style={style}>{ExecutionStatusCode[executedTask.execution_status_code]}</td>
                <td style={style}>{ExecutionStatus[executedTask.last_process_status_code]}</td>
                <td style={style}>{`${CompletionStatusCode[executedTask.completion_status_code]} (${exitCodeText})`}</td>
                <td style={style}>{durationText}</td>
                <td style={style}
                    className="text-right">{`${formatCpuUsage(executedTask.max_cpu)} | ${formatMemoryFromMB(executedTask.max_memory)}`}</td>
                <td style={style} className="text-center">{formatValue(executedTask.local_work_units, 0)}</td>
                <td style={style}>{(new Date(executedTask.completed_at)).toLocaleString()}</td>
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
                    <RemovedCompletedMutation mutation={REMOVE_COMPLETED_MUTATION}
                                              refetchQueries={["ExecutedPageQuery"]}
                                              onError={(error) => {
                                                  console.log("there was an error clearing completed executions", error);
                                              }}>
                        {(removeCompletedExecutionsWithCode) => (
                            <Button bsSize="sm"
                                    onClick={() => removeCompletedExecutionsWithCode({variables: {code: CompletionStatusCode.Success}})}>
                                <Glyphicon glyph="trash"/>&nbsp; Clear Success
                            </Button>
                        )}
                    </RemovedCompletedMutation>
                    <RemovedCompletedMutation mutation={REMOVE_COMPLETED_MUTATION}
                                              refetchQueries={["ExecutedPageQuery"]}
                                              onError={(error) => {
                                                  console.log("there was an error clearing canceled executions", error);
                                              }}>
                        {(removeCompletedExecutionsWithCode) => (
                            <Button bsSize="sm"
                                    onClick={() => removeCompletedExecutionsWithCode({variables: {code: CompletionStatusCode.Cancel}})}>
                                <Glyphicon glyph="trash"/>&nbsp; Clear Canceled
                            </Button>
                        )}
                    </RemovedCompletedMutation>
                    <RemovedCompletedMutation mutation={REMOVE_COMPLETED_MUTATION}
                                              refetchQueries={["ExecutedPageQuery"]}
                                              onError={(error) => {
                                                  console.log("there was an error clearing failed executions", error);
                                              }}>
                        {(removeCompletedExecutionsWithCode) => (
                            <Button bsSize="sm"
                                    onClick={() => removeCompletedExecutionsWithCode({variables: {code: CompletionStatusCode.Error}})}>
                                <Glyphicon glyph="trash"/>&nbsp; Clear Failed
                            </Button>
                        )}
                    </RemovedCompletedMutation>
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
