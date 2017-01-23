import * as React from "react";
import {Table} from "react-bootstrap"
import moment = require("moment");

import {ITaskStatistics, ITaskDefinition} from "./QueryInterfaces";

interface ITaskStatisticsRowProps {
    statistic: ITaskStatistics;
    definitions :ITaskDefinition[]
}

function formatValue(val, truncate = 2) {
    if (!val) {
        return "n/a";
    }

    return val.toFixed(truncate);
}

class TaskStatisticsRow extends React.Component<ITaskStatisticsRowProps, any> {
    render() {
        let statistic = this.props.statistic;

        return (
            <tr>
                <td>{statistic.task_id}</td>
                <td>{`${statistic.num_execute} | ${statistic.num_complete} | ${statistic.num_error} | ${statistic.num_cancel}`}</td>
                <td>{`${formatValue(statistic.cpu_high)} | ${formatValue(statistic.cpu_low)} | ${formatValue(statistic.cpu_average)}`}</td>
                <td>{`${formatValue(statistic.memory_high)} | ${formatValue(statistic.memory_low)} | ${formatValue(statistic.memory_average)}`}</td>
                <td>{`${formatValue(statistic.duration_high * 3600)} | ${formatValue(statistic.duration_low * 3600)} | ${formatValue(statistic.duration_average * 3600)}`}</td>
            </tr>);
    }
}

interface ITaskStatisticsTable {
    statistics: ITaskStatistics[];
    definitions :ITaskDefinition[]
}

export class TaskStatisticsTable extends React.Component<ITaskStatisticsTable, any> {
    render() {
        let rows = this.props.statistics.map(s => (<TaskStatisticsRow key={"tr_" + s.id} statistic={s} definitions={this.props.definitions}/>));

        return (
            <Table striped condensed>
                <thead>
                <tr>
                    <td>Task</td>
                    <td>Run Total | Complete | Error |Cancel</td>
                    <td>CPU High | Low | Average (%)</td>
                    <td>Memory High | Low | Average (MB)</td>
                    <td>Duration High | Low | Average (s)</td>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}
