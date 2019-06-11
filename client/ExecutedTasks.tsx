import * as React from "react";
import {Panel, Pagination} from "react-bootstrap"

import {Query} from "react-apollo";
import gql from "graphql-tag";

import {ExecutedTasksTable} from "./ExecutedTasksTable";
import {pollingIntervalSeconds} from "./GraphQLComponents";
import {ITaskExecution} from "./QueryInterfaces";

type ExecutedTasksState = {
    offset?: number;
    limit?: number;
}

export class ExecutedTasks extends React.Component<{}, ExecutedTasksState> {
    public constructor(props: any) {
        super(props);

        this.state = {
            offset: 0,
            limit: 30
        }
    }

    private updateOffset(offset: number) {
        this.setState({offset});
    }

    public render() {
        return (
            <Query query={ExecutedPageQuery} pollInterval={pollingIntervalSeconds * 1000} variables={{
                requestedOffset: this.state.offset,
                executedPageLimit: this.state.limit
            }}>
                {({loading, error, data}) => {
                    if (!loading && !error) {
                        return (
                            <Panel collapsible defaultExpanded header="Task Executions" bsStyle="primary">
                                <TablePanel offset={this.state.offset} limit={this.state.limit}
                                            total={data.taskExecutionPage.totalCount}
                                            items={data.taskExecutionPage.items}
                                            didChangeOffset={(offset: number) => this.updateOffset(offset)}/>
                            </Panel>
                        );
                    } else {
                        return <NoTasks/>;
                    }
                }}
            </Query>
        );
    }
}

type TablePanelProps = {
    total: number;
    offset: number;
    limit: number;
    items: ITaskExecution[];

    didChangeOffset(offset: number): void;
}

class TablePanel extends React.Component<TablePanelProps, {}> {
    public render() {
        if (this.props.items.length > 0) {
            const pageCount = Math.ceil(this.props.total / this.props.limit);

            const activePage = this.props.offset ? (Math.floor(this.props.offset / this.props.limit) + 1) : 1;

            return (
                <div>
                    {pageCount > 1 ?
                        <Pagination prev next first last ellipsis boundaryLinks items={pageCount} maxButtons={10}
                                    activePage={activePage}
                                    onSelect={(page: any) => {
                                        this.props.didChangeOffset(this.props.limit * (page - 1))
                                    }}/> : null}

                    <ExecutedTasksTable executedTasks={this.props.items}/>
                </div>
            );
        }

        return <NoTasks/>;
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

const ExecutedPageQuery = gql`query ExecutedPageQuery($requestedOffset: Int, $executedPageLimit: Int) {
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
      max_cpu_percent
      max_memory_mb
      started_at
      completed_at
    }
  }
}`;
