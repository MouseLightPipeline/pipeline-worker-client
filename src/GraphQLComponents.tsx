import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {TaskDefinitions} from "./TaskDefinitions";

const TaskDefinitionsQuery = gql`query { 
    taskDefinitions {
      id
      name
      description
      script
      interpreter
    }
}`;

export const TaskDefinitionsWithQuery = graphql(TaskDefinitionsQuery, {
    options: {pollInterval: 200000},
})(TaskDefinitions);

