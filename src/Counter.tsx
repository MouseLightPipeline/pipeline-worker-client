import * as React from 'react';
import {Component, PropTypes} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

class Counter extends Component<any, any> {
    interval: any;

    constructor(props) {
        super(props);
        this.state = {counter: 0};
    }

    componentDidMount() {
        this.interval = setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.setState({
            counter: this.state.counter + 1
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <h2>Counters: {this.state.counter}</h2>
                {this.props.data.loading ? null : (this.props.data.runningTasks && this.props.data.runningTasks.length > 0 ?
                    <RunningTaskTable tasks={this.props.data.runningTasks}/> : <NoRunningTasks/>)}
                {this.props.data.loading ? <Loading /> : null}
            </div>
        );
    }
}
/*
Counter.propTypes = {
    data: PropTypes.shape({
        runningTasks: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: PropTypes.string
            })
        )
    })
};
*/
function NoRunningTasks() {
    return (<div>No running tasks</div>)
}

class RunningTaskTable extends Component<any, any> {
    render() {
        return (
            <table>
                <thead>
                <tr>
                    <td>ID</td>
                    <td>Started</td>
                    <td>Script</td>
                    <td>Max CPU</td>
                    <td>Max Memory (MB)</td>
                </tr>
                </thead>
                <tbody>
                {this.props.tasks.map(task => (<tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{(new Date(parseInt(task.started_at))).toLocaleString()}</td>
                    <td>{task.resolved_script}</td>
                    <td>{task.max_cpu}</td>
                    <td>{task.max_memory / 1024 / 1024}</td>
                </tr>))}
                </tbody>
            </table>
        )
    }
}
/*
RunningTaskTable.propTypes = {
    tasks: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            id: PropTypes.string,
            started_at: PropTypes.string,
            resolved_script: PropTypes.string,
            max_cpu: PropTypes.number,
            max_memory: PropTypes.number,
        })
    )
};*/


function Loading() {
    return (
        <div>Loading...</div>
    );
}
const MyQuery = gql`query { 
    runningTasks {
        id
        started_at
        resolved_script
        max_cpu
        max_memory
    }
}`;


const MyComponentWithData = graphql(MyQuery, {
    options: {pollInterval: 2000},
})(Counter);

export default MyComponentWithData;