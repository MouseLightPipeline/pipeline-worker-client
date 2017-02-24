import * as React from "react";
import {Panel} from "react-bootstrap"

import {RunningTasksTable} from "./RunningTaskTable";
import {Loading} from "./Loading";
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

        let workUnitCapacity = -1;
        if (this.props.data && this.props.data.workUnitCapacity) {
            workUnitCapacity = this.props.data.workUnitCapacity;
        }

        return (
            <div>
                {this.props.data.loading ? <Loading/> : <TablePanel runningTasks={runningTasks} workUnitCapacity={workUnitCapacity} onCancelTask={this.onCancelTask}/>}
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    render() {
        let load = "";

        if (this.props.workUnitCapacity > 0) {
            let usage = this.props.runningTasks.reduce((prev: any, next: IRunningTask) => {
                return prev + next.work_units;
            }, 0);

            let usagePercentage = 100 * usage/this.props.workUnitCapacity;

            load = ` - Load ${usagePercentage.toFixed(1)}% (${usage.toFixed(1)}/${this.props.workUnitCapacity.toFixed(1)})`;
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