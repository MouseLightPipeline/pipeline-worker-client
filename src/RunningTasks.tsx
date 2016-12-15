import * as React from "react";
import {Panel} from "react-bootstrap"

import {RunningTasksTable} from "./RunningTaskTable";
import {Loading} from "./Loading";

export class RunningTasks extends React.Component<any, any> {
    render() {
        let runningTasks = [];

        if (this.props.data && this.props.data.runningTasks) {
            runningTasks = this.props.data.runningTasks;
        }

        return (
            <div>
                {this.props.data.loading ? <Loading/> : <TablePanel runningTasks={runningTasks}/>}
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Panel collapsible defaultExpanded header="Running Tasks" bsStyle="primary">
                    {this.props.runningTasks.length === 0 ? <NoRunngTasks/> :
                        <RunningTasksTable runningTasks={this.props.runningTasks}/> }
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