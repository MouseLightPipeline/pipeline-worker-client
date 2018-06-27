import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {TaskStatistics} from "./TaskStatistics";

export const pollingIntervalSeconds = 10;

export const WorkerQuery = gql`query {
    worker {
      id
      process_id
      local_task_load
      cluster_task_load
      local_work_capacity
      cluster_work_capacity
    }
}`;

const TaskDefinitionsQuery = gql`query { 
    taskDefinitions {
      id
      name
      description
      script
      interpreter
      script_args
      cluster_args
      work_units
      cluster_work_units
      log_prefix
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

export const TaskStatisticsWithQuery = graphql(TaskStatisticsQuery, {options: {pollInterval: pollingIntervalSeconds * 1000}})(
    graphql(TaskDefinitionsQuery, {
        name: 'taskDefinitionsData'
    })(TaskStatistics));
