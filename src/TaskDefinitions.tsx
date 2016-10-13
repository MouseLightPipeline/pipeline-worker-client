import * as React from "react";

import {TaskDefinitionsTable} from "./TaskDefinitionTable";
import {StartTaskComponent} from "./StartTaskContainer";

export class TaskDefinitions extends React.Component<any, any> {
    render() {
        let taskDefinitions = [];

        if (this.props.data && this.props.data.taskDefinitions) {
            taskDefinitions = this.props.data.taskDefinitions;
        }

        return (
            <div>
                <h2>Task Definitions</h2>
                <TaskDefinitionsTable taskDefinitions={taskDefinitions}/>
                <StartTaskComponent taskDefinitions={taskDefinitions}/>
            </div>
        );
    }
}
