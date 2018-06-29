import gql from "graphql-tag";

export const pollingIntervalSeconds = 10;

export const WorkerQuery = gql`query {
    worker {
      id
      display_name
      process_id
      local_task_load
      cluster_task_load
      local_work_capacity
      cluster_work_capacity
    }
}`;
