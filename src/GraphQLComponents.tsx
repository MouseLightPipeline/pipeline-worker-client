import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {TaskDefinitions} from "./TaskDefinitions";
import {RunningTasks} from "./RunningTasks";
import {ExecutedTasks} from "./ExecutedTasks";
import {TaskStatistics} from "./TaskStatistics";

const env = process.env.NODE_ENV || "development";

let pollingIntervalSeconds = 30;

if (env !== "production") {
    pollingIntervalSeconds = 2;
}

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
        task_id
        task {
            id
            name
        }
        resolved_args
        max_cpu
        max_memory
        started_at
    }
    workUnitCapacity
}`;

const ExecutedTasksQuery = gql`query { 
    taskExecutions {
        id
        machine_id
        task_id
        task {
            id
            name
        }
        work_units
        resolved_script
        resolved_interpreter
        resolved_args
        last_process_status_code
        completion_status_code
        execution_status_code
        exit_code
        max_cpu
        max_memory
        started_at
        completed_at
    }
}`;

const TaskStatisticsQuery = gql`query { 
    taskStatistics {
        id
        task_id
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

export const ExecutedTasksWithQuery = graphql(ExecutedTasksQuery, {options: {pollInterval: pollingIntervalSeconds * 1000}})(
    graphql(TaskDefinitionsQuery, {
        name: 'taskDefinitionsData'
    })(ExecutedTasks));

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
