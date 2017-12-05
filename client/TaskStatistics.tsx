import * as React from "react";
import {Panel} from "react-bootstrap"

import {TaskStatisticsTable} from "./TaskStatisticsTable";
import {Loading} from "./Loading";

export class TaskStatistics extends React.Component<any, any> {
    render() {
        let statistics = [];

        if (this.props.data && this.props.data.taskStatistics) {
            statistics = this.props.data.taskStatistics;
        }

        let definitions = [];

        if (this.props.taskDefinitionsData && this.props.taskDefinitionsData.taskDefinitions) {
            definitions = this.props.taskDefinitionsData.taskDefinitions;
        }

        return (
            <div>
                {this.props.data.loading ? <Loading/> : <TablePanel statistics={statistics} definitions={definitions}/>}
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    render() {
        return (
            <div>
                <Panel collapsible defaultExpanded header="Task Statistics" bsStyle="primary">
                    {this.props.statistics.length === 0 ? <NoTaskStatistics/> :
                        <TaskStatisticsTable statistics={this.props.statistics} definitions={this.props.definitions}/> }
                </Panel>
            </div>
        );
    }
}

class NoTaskStatistics extends React.Component<any, any> {
    render() {
        return (
            <div>
                There are no task statistics
            </div>);
    }
}
