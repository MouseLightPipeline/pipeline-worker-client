import * as React from "react";
import {Panel, Pagination} from "react-bootstrap"

import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {ExecutedTasksTable} from "./ExecutedTasksTable";
import {pollingIntervalSeconds} from "./GraphQLComponents";
import {ITaskExecution} from "./QueryInterfaces";

export interface IExecutionPage {
    offset: number;
    limit: number;
    totalCount: number;
    hasNextPage: boolean;
    items: ITaskExecution[]
}

export class ExecutedTasks extends React.Component<any, any> {
    public constructor(props: any) {
        super(props);

        this.state = {
            executedPageOffset: 0,
            executedPageLimit: 30,
            executedPageTotalCount: -1,
            requestedOffset: 0
        }
    }

    private updateOffset(offset: number) {
        if (offset != this.state.requestedOffset) {
            this.setState({requestedOffset: offset}, null);
        }
    }

    private updateCursor(page: IExecutionPage) {
        if (page.offset !== this.state.executedPageOffset || page.limit !== this.state.executedPageLimit || page.totalCount !== this.state.executedPageTotalCount) {
            this.setState({
                executedPageOffset: page.offset,
                executedPageLimit: page.limit,
                executedPageTotalCount: page.totalCount
            }, null);
        }
    }

    public render() {
        return (
            <div>
                <TablePanelWithQuery executedPageOffset={this.state.executedPageOffset}
                                     executedPageLimit={this.state.executedPageLimit}
                                     executedPageTotalCount={this.state.executedPageTotalCount}
                                     requestedOffset={this.state.requestedOffset}
                                     onUpdateOffset={(offset: number) => this.updateOffset(offset)}
                                     onCursorChanged={(page: IExecutionPage) => this.updateCursor(page)}/>
            </div>
        );
    }
}

class TablePanel extends React.Component<any, any> {
    public render() {
        let executedTasks = [];

        if (this.props.data && this.props.data.taskExecutionPage) {
            executedTasks = this.props.data.taskExecutionPage.items;
        }

        const pageCount = Math.ceil(this.props.executedPageTotalCount / this.props.executedPageLimit);

        const activePage = this.props.executedPageOffset ? (Math.floor(this.props.executedPageOffset / this.props.executedPageLimit) + 1) : 1;

        return (
            <div>

                <Panel collapsible defaultExpanded header="Task Executions" bsStyle="primary">
                    {pageCount > 1 ?
                        <Pagination prev next first last ellipsis boundaryLinks items={pageCount} maxButtons={10}
                                    activePage={activePage}
                                    onSelect={(page: any) => {
                                        this.props.onUpdateOffset(this.props.executedPageLimit * (page - 1))
                                    }}/> : null}
                    {executedTasks.length === 0 ? <NoTasks/> :
                        <ExecutedTasksTable executedTasks={executedTasks}/>}
                </Panel>
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: any) {
        if (nextProps.data && nextProps.data.taskExecutionPage) {
            nextProps.onCursorChanged(nextProps.data.taskExecutionPage);
        }
    }
}

class NoTasks extends React.Component<any, any> {
    public render() {
        return (<div> There are no task executions. </div>);
    }
}

const ExecutedConnectionsQuery = gql`query($executedPageFirst: Int, $executedPageAfter: String) {
  taskExecutionConnections(first: $executedPageFirst, after: $executedPageAfter) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        id
        worker_id
        task_definition_id
        task {
          id
          name
        }
        local_work_units
        cluster_work_units
        resolved_script
        resolved_interpreter
        resolved_script_args
        last_process_status_code
        completion_status_code
        execution_status_code
        exit_code
        cpu_time_seconds
        max_cpu_percent
        max_memory_mb
        started_at
        completed_at
      }
      cursor
    }
  }
}`;

const ExecutedPageQuery = gql`query($requestedOffset: Int, $executedPageLimit: Int) {
  taskExecutionPage(offset: $requestedOffset, limit: $executedPageLimit) {
    offset
    limit
    totalCount
    hasNextPage
    items {
      id
      worker_id
      task_definition_id
      task {
        id
        name
      }
      tile_id
      local_work_units
      cluster_work_units
      resolved_script
      resolved_interpreter
      resolved_script_args
      last_process_status_code
      completion_status_code
      execution_status_code
      exit_code
      max_cpu
      max_memory
      started_at
      completed_at
    }
  }
}`;

const TablePanelWithQuery = graphql(ExecutedPageQuery, {
    options: ({requestedOffset, executedPageLimit}) => ({
        pollInterval: pollingIntervalSeconds * 1000,
        variables: {requestedOffset, executedPageLimit}
    })
})(TablePanel);
