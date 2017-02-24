import * as React from "react";
import {Table, Glyphicon, Button} from "react-bootstrap"
import FontAwesome = require("react-fontawesome");
import gql from "graphql-tag";
import {graphql} from "react-apollo";
import moment = require("moment");

import {ITaskStatistics, ITaskDefinition} from "./QueryInterfaces";
import {formatCpuUsage, formatMemoryFromMB, formatDurationFromHours} from "./util/formatters";

interface ITaskStatisticsRowProps {
    statistic: ITaskStatistics;
    definitions: ITaskDefinition[]
}

const quarterStyle = {width: "25%"};
const thirdStyle = {width: "33%"};

const tightTable = {padding: "0", margin: "0", width: "100%"};
const tightTableBody = {padding: "0", margin: "0"};

const completeStyle = {color: "green"};
const cancelStyle = {color: "orange"};
const errorStyle = {color: "red"};

const ResetStatisticsMutation = gql`
  mutation resetStatistics($taskId: String) {
    resetStatistics(taskId: $taskId)
  }
`;

class ResetStatisticsButton extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isInReset: false,
        };
    }

    onClick = () => {
        if (this.state.isInReset) {
            return;
        }

        this.setState({isInReset: true}, null);

        this.props.resetStatisticsMutation(this.props.taskId)
        .then(() => {
        }).catch((error: any) => {
            this.setState({isInReset: false}, null);
            console.log("there was an error resetting statistics", error);
        });
    };

    render() {
        return (<Button disabled={this.state.isInReset} bsSize="xs" bsStyle="danger" onClick={this.onClick}>{this.state.isInReset ?
            <FontAwesome name='spinner' spin/> : <Glyphicon glyph="remove"/>}&nbsp;
            Reset</Button>)
    }
}

const ResetStatisticsButtonWithMutation = graphql(ResetStatisticsMutation, {
    props: ({mutate}) => ({
        resetStatisticsMutation: (taskId: string) => mutate({
            variables: {
                taskId: taskId
            }
        })
    })
})(ResetStatisticsButton);

class TaskStatisticsRow extends React.Component<ITaskStatisticsRowProps, any> {
    render() {
        let statistic = this.props.statistic;

        return (
            <tr>
                <td><ResetStatisticsButtonWithMutation taskId={statistic.task_id}/></td>
                <td>{statistic.task.name}</td>
                <td className="text-center">
                    <table style={tightTable}>
                        <tbody style={tightTableBody}>
                        <tr>
                            <td className="text-center" style={quarterStyle}>{`${statistic.num_execute}`}</td>
                            <td className="text-center" style={quarterStyle}><span
                                style={completeStyle}>{`${statistic.num_complete}`}</span></td>
                            <td className="text-center" style={quarterStyle}><span
                                style={errorStyle}>{`${statistic.num_error}`}</span></td>
                            <td className="text-center"
                                style={quarterStyle}><span style={cancelStyle}>{`${statistic.num_cancel}`}</span></td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                <td className="text-center">
                    <table style={tightTable}>
                        <tbody style={tightTableBody}>
                        <tr>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatCpuUsage(statistic.cpu_high)}`}</td>
                            <td className="text-center" style={thirdStyle}>{`${formatCpuUsage(statistic.cpu_low)}`}</td>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatCpuUsage(statistic.cpu_average)}`}</td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                <td className="text-center">
                    <table style={tightTable}>
                        <tbody style={tightTableBody}>
                        <tr>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatMemoryFromMB(statistic.memory_high)}`}</td>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatMemoryFromMB(statistic.memory_low)}`}</td>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatMemoryFromMB(statistic.memory_average)}`}</td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                <td className="text-center">
                    <table style={tightTable}>
                        <tbody style={tightTableBody}>
                        <tr>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatDurationFromHours(statistic.duration_high)}`}</td>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatDurationFromHours(statistic.duration_low)}`}</td>
                            <td className="text-center"
                                style={thirdStyle}>{`${formatDurationFromHours(statistic.duration_average)}`}</td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </tr>);
    }
}

interface ITaskStatisticsTable {
    statistics: ITaskStatistics[];
    definitions: ITaskDefinition[]
}

export class TaskStatisticsTable extends React.Component<ITaskStatisticsTable, any> {
    render() {
        let rows = this.props.statistics.map(s => (
            <TaskStatisticsRow key={"tr_" + s.id} statistic={s} definitions={this.props.definitions}/>));

        return (
            <Table striped condensed>
                <thead>
                <tr>
                    <th/>
                    <th>Task</th>
                    <th className="text-center">Runs
                        <Table style={{padding: "0", margin:"0"}}>
                            <tbody>
                            <tr>
                                <td className="text-center" style={quarterStyle}>Total</td>
                                <td className="text-center" style={quarterStyle}>Complete</td>
                                <td className="text-center" style={quarterStyle}>Error</td>
                                <td className="text-center" style={quarterStyle}>Cancel</td>
                            </tr>
                            </tbody>
                        </Table>
                    </th>
                    <th className="text-center">CPU
                        <Table style={{padding: "0", margin:"0"}}>
                            <tbody>
                            <tr>
                                <td className="text-center" style={thirdStyle}>High</td>
                                <td className="text-center" style={thirdStyle}>Low</td>
                                <td className="text-center" style={thirdStyle}>Average</td>
                            </tr>
                            </tbody>
                        </Table>
                    </th>
                    <th className="text-center">Memory
                        <Table style={{padding: "0", margin:"0"}}>
                            <tbody>
                            <tr>
                                <td className="text-center" style={thirdStyle}>High</td>
                                <td className="text-center" style={thirdStyle}>Low</td>
                                <td className="text-center" style={thirdStyle}>Average</td>
                            </tr>
                            </tbody>
                        </Table>
                    </th>
                    <th className="text-center">Duration
                        <Table style={{padding: "0", margin:"0"}}>
                            <tbody>
                            <tr>
                                <td className="text-center" style={thirdStyle}>High</td>
                                <td className="text-center" style={thirdStyle}>Low</td>
                                <td className="text-center" style={thirdStyle}>Average</td>
                            </tr>
                            </tbody>
                        </Table>
                    </th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}
