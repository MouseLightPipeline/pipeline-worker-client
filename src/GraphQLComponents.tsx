import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {TaskDefinitions} from "./TaskDefinitions";
import {RunningTasks} from "./RunningTasks";
import {TaskStatistics} from "./TaskStatistics";

export const pollingIntervalSeconds = 10;

export const WorkerQuery = gql`query {
    worker {
      id
      process_id
      work_capacity
      is_cluster_proxy
    }
}`;

const TaskDefinitionsQuery = gql`query { 
    taskDefinitions {
      id
      name
      description
      script
      interpreter
      args
      work_units
    }
}`;

const RunningTasksQuery = gql`query { 
    runningTasks {
        id
        work_units
        task_definition_id
        task {
            id
            name
        }
        resolved_args
        max_cpu
        max_memory
        started_at
    }
}`;

const TaskStatisticsQuery = gql`query { 
    taskStatistics {
        id
        task_definition_id
        task {
            id
            name
        }
        num_execute
        num_complete
        num_error
        num_cancel
        cpu_average
        cpu_high
        cpu_low
        memory_average
        memory_high
        memory_low
        duration_average
        duration_high
        duration_low
    }
}`;

const StartTaskMutation = gql`
  mutation StartTaskMutation($taskDefinitionId: String!, $scriptArgs: [String!]) {
    startTask(taskDefinitionId:$taskDefinitionId, scriptArgs:$scriptArgs) {
      id
    }
  }
`;

const StopExecutionMutation = gql`
  mutation StopExecutionMutation($taskExecutionId: String!) {
    stopTask(taskExecutionId: $taskExecutionId,) {
      id
    }
  }
`;

export const TaskStatisticsWithQuery = graphql(TaskStatisticsQuery, {options: {pollInterval: pollingIntervalSeconds * 1000}})(
    graphql(TaskDefinitionsQuery, {
        name: 'taskDefinitionsData'
    })(TaskStatistics));

export const RunningTasksWithQuery = graphql(RunningTasksQuery, {options: {pollInterval: pollingIntervalSeconds * 1000}})(
    graphql(StopExecutionMutation, {
        props: ({mutate}) => ({
            stopExecution: (taskExecutionId: string) => mutate({
                variables: {
                    taskExecutionId: taskExecutionId,
                }
            })
        })
    })(RunningTasks));

export const TaskDefinitionsWithQuery = graphql(TaskDefinitionsQuery, {options: {pollInterval: pollingIntervalSeconds * 1000}})(
    graphql(StartTaskMutation, {
        props: ({mutate}) => ({
            startTaskMutation: (taskDefinitionId: string, scriptArgs: string[]) => mutate({
                variables: {
                    taskDefinitionId: taskDefinitionId,
                    scriptArgs: scriptArgs
                }
            })
        })
    })(TaskDefinitions));
