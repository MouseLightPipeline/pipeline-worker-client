import * as React from "react";
import {Table, Button, Glyphicon} from "react-bootstrap"
import moment = require("moment");

import {ExecutionStatus, IRunningTask} from "./QueryInterfaces";
import {formatMemoryFromMB, formatCpuUsage} from "./util/formatters";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

interface IIRunningTaskRowProps {
    runningTask: IRunningTask;
}

class RunningTaskRow extends React.Component<IIRunningTaskRowProps, any> {
    render() {
        const runningTask = this.props.runningTask;

        const elapsed = runningTask.last_process_status_code === ExecutionStatus.Pending ?
            moment().diff(moment(new Date(runningTask.submitted_at))) :
            moment().diff(moment(new Date(runningTask.started_at)));

        const elapsedText = runningTask.last_process_status_code === ExecutionStatus.Pending ?
            `pending ${moment.duration(elapsed).humanize()}` :
            `${moment.duration(elapsed).humanize()}`;

        const taskName = runningTask.resolved_script;

        return (
            <tr>
                <td>
                    <StopExecutionMutation mutation={STOP_EXECUTION_MUTATION}
                                           refetchQueries={["RunningTasksQuery"]}
                                           onError={(error) => {
                                               console.log("there was an error stopping the task", error);
                                           }}>
                        {(removeCompletedExecutionsWithCode) => (
                            <Button bsSize="xs" bsStyle="danger"
                                    onClick={() => removeCompletedExecutionsWithCode({variables: {taskExecutionId: runningTask.id}})}>
                                <Glyphicon glyph="stop"/>Cancel
                            </Button>
                        )}
                    </StopExecutionMutation>
                </td>
                <td>{new Date(parseInt(runningTask.started_at)).toLocaleString()}</td>
                <td>{elapsedText}</td>
                <td>{taskName}</td>
                <td>{runningTask.tile_id} </td>
                <td>{runningTask.queue_type == 0 ? runningTask.local_work_units : runningTask.cluster_work_units}</td>
                <td>{formatCpuUsage(runningTask.max_cpu)}</td>
                <td>{formatMemoryFromMB(runningTask.max_memory)}</td>
                <td>{runningTask.queue_type == 0 ? "local" : "cluster"}</td>
            </tr>);
    }
}

interface IRunningTasksTable {
    runningTasks: IRunningTask[];
}

export class RunningTasksTable extends React.Component<IRunningTasksTable, any> {
    render() {
        let rows = this.props.runningTasks.map(runningTask => (
            <RunningTaskRow key={"tr_r" + runningTask.id} runningTask={runningTask}/>));

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
                    <th>Location</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}

const STOP_EXECUTION_MUTATION = gql`
  mutation StopExecutionMutation($taskExecutionId: String!) {
    stopTask(taskExecutionId: $taskExecutionId) {
      id
    }
  }
`;

type StopExecutionVariables = {
    taskExecutionId: string;
}

type StopExecutionCompletedData = {
    id: string;
}

type StopExecutionMutationResponse = {
    stopTask: StopExecutionCompletedData;
}

class StopExecutionMutation extends Mutation<StopExecutionMutationResponse, StopExecutionVariables> {
}
