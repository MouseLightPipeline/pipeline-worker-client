import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {TaskDefinitions} from "./TaskDefinitions";
import {RunningTasks} from "./RunningTasks";
import {ExecutedTasks} from "./ExecutedTasks";

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
    }
}`;

const RunningTasksQuery = gql`query { 
    runningTasks {
        id
        started_at
        resolved_script
        max_cpu
        max_memory
    }
}`;

const ExecutedTasksQuery = gql`query { 
    taskExecutions {
        id
        task_id
        script_args
        resolved_script
        resolved_interpreter
        last_process_status_code
        completion_status_code
        execution_status_code
    }
}`;

const StartTaskMutation = gql`
  mutation StartTaskMutation($taskDefinitionId: String!, $scriptArgs: [String!]) {
    startTask(taskDefinitionId:$taskDefinitionId, scriptArgs:$scriptArgs) {
      id
    }
  }
`;

const ClearCompletedExecutionsMutation = gql`
  mutation ClearCompletedExecutionsMutation {
    clearAllCompleteExecutions
  }
`;

export const RunningTasksWithQuery = graphql(RunningTasksQuery, {
    options: {pollInterval: 2000},
})(RunningTasks);

export const ExecutedTasksWithQuery = graphql(ExecutedTasksQuery, { options: {pollInterval: pollingIntervalSeconds * 1000}})(
    graphql(ClearCompletedExecutionsMutation, {
        props: ({mutate}) => ({
            clearCompletedExecutions: () => mutate({})
        })
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
