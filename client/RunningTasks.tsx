import * as React from "react";
import {Panel} from "react-bootstrap"

import {RunningTasksTable} from "./RunningTaskTable";
import {IRunningTask, IWorker} from "./QueryInterfaces";
import {graphql, Mutation, Query} from "react-apollo";
import {pollingIntervalSeconds} from "./GraphQLComponents";
import gql from "graphql-tag";

const NoRunningTasks = () => (
    <div>
        There are no running tasks.
    </div>
);

export interface IRunningTasksState {
}

export interface IRunningTasksProps {
    data?: any;
    worker: IWorker;
}

export class RunningTasks extends React.Component<IRunningTasksProps, IRunningTasksState> {
    render() {
        let runningTasks = [];

        if (this.props.data && this.props.data.runningTasks) {
            runningTasks = this.props.data.runningTasks;
        }

        return (
            <div>
                <TablePanel runningTasks={runningTasks} worker={this.props.worker}/>
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    private calculateLocalLoad(): string {
        if (!this.props.worker || this.props.worker.local_work_capacity <= 0) {
            return "";
        }

        return `Local Load ${calculateLoad(this.props.worker.local_task_load, this.props.worker.local_work_capacity)}`;
    }

    private calculateClusterLoad(): string {
        if (!this.props.worker || this.props.worker.cluster_work_capacity <= 0) {
            return "";
        }

        return `Cluster Load ${calculateLoad(this.props.worker.cluster_task_load, this.props.worker.cluster_work_capacity)}`;
    }

    public render() {
        const load = ` - ${this.calculateLocalLoad()} ${this.calculateClusterLoad()}`;

        return (
            <div>
                <Panel collapsible defaultExpanded header={`Running Tasks${load}`} bsStyle="primary">

                    <Query query={RunningTasksQuery} pollInterval={pollingIntervalSeconds * 1000}>
                        {({loading, error, data}) => {
                            if (!loading && !error && data.runningTasks.length > 0) {
                                return <RunningTasksTable runningTasks={data.runningTasks}/>
                            }

                            return <NoRunningTasks/>;
                        }}
                    </Query>
                </Panel>
            </div>
        );
    }
}

const RunningTasksQuery = gql`query RunningTasksQuery { 
    runningTasks {
        id
        local_work_units
        cluster_work_units
        queue_type
        task_definition_id
        tile_id
        task {
            id
            name
        }
        resolved_script
        resolved_script_args
        cpu_time_seconds
        max_cpu_percent
        max_memory_mb
        submitted_at
        started_at
        last_process_status_code
    }
}`;

function calculateLoad(amount: number, capacity: number): string {
    const usagePercentage = 100 * amount / capacity;

    return `${usagePercentage.toFixed(1)}% (${amount.toFixed(1)}/${capacity.toFixed(1)})`;
}
