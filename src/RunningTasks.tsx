import * as React from "react";
import {Panel} from "react-bootstrap"

import {RunningTasksTable} from "./RunningTaskTable";
import {IRunningTask} from "./QueryInterfaces";

export class RunningTasks extends React.Component<any, any> {
    onCancelTask = (id: string) =>  {
        this.props.stopExecution(id)
        .then((obj: any) => {
            console.log(`Stopped ${obj}`);
        }).catch((error: any) => {
            console.log("there was an error stopping the task", error);
        });
    };

    render() {
        let runningTasks = [];

        if (this.props.data && this.props.data.runningTasks) {
            runningTasks = this.props.data.runningTasks;
        }

        return (
            <div>
                <TablePanel runningTasks={runningTasks} worker={this.props.worker} onCancelTask={this.onCancelTask}/>
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    render() {
        let load = "";

        let workUnitCapacity = -1;

        if (this.props.worker) {
            workUnitCapacity = this.props.worker.work_capacity;
        }

        let usage = 0;

        if (workUnitCapacity > 0) {
            if(this.props.worker.is_cluster_proxy) {
                usage = this.props.runningTasks.length;
            } else {
                usage = this.props.runningTasks.reduce((prev: any, next: IRunningTask) => {
                    return prev + next.work_units;
                }, 0);
            }

            let usagePercentage = 100 * usage/workUnitCapacity;

            load = ` - Load ${usagePercentage.toFixed(1)}% (${usage.toFixed(1)}/${workUnitCapacity.toFixed(1)})`;
        }

        return (
            <div>
                <Panel collapsible defaultExpanded header={`Running Tasks${load}`} bsStyle="primary">
                    {this.props.runningTasks.length === 0 ? <NoRunngTasks/> :
                        <RunningTasksTable runningTasks={this.props.runningTasks} onCancelTask={this.props.onCancelTask}/> }
                </Panel>
            </div>
        );
    }
}

class NoRunngTasks extends React.Component<any, any> {
    render() {
        return (
            <div>
                There are no running tasks.
            </div>);
    }
}