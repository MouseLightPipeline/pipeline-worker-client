import {graphql} from "react-apollo";
import gql from "graphql-tag";

import {TaskDefinitions} from "./TaskDefinitions";
import {RunningTasks} from "./RunningTasks";

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

export const TaskDefinitionsWithQuery = graphql(TaskDefinitionsQuery, {
    options: {pollInterval: 2000},
})(TaskDefinitions);

export const RunningTasksWithQuery = graphql(RunningTasksQuery, {
    options: {pollInterval: 2000},
})(RunningTasks);
