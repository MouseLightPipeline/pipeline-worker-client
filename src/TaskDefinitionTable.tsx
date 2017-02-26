import * as React from "react";
import {Table} from "react-bootstrap"
import graphql from "react-apollo/graphql";
import gql from "graphql-tag/index";

import {ITaskDefinition, ITaskDefinitionInput} from "./QueryInterfaces";
import {
    DynamicEditField, clickToEditFormatFunction, nonNegativeNumberFilterFunction,
    nonNegativeNumberFormatFunction
} from "./Component/DynamicField";

interface ITaskDefinitionRowProps {
    taskDefinition: ITaskDefinition;

    onUpdateTaskDefinition(taskDefinition: ITaskDefinitionInput): void;
}

const columnLimitStyle = {
    "maxWidth": "200px"
};

class TaskDefinitionRow extends React.Component<ITaskDefinitionRowProps, any> {
    constructor(props: ITaskDefinitionRowProps) {
        super(props);
        this.state = {
            taskDefinition: props.taskDefinition,
            revertValue: null,
        }
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({taskDefinition: nextProps.taskDefinition}, null);
    }

    onAcceptEdit(property: string, value: any): boolean {
        let taskDefinition: any = {id: this.state.taskDefinition.id};

        taskDefinition[property] = value;

        this.props.onUpdateTaskDefinition(taskDefinition);

        return true;
    };

    onAcceptWorkUnitEdit(property: string, value: any): boolean {
        if (value.length === 0) {
            return false;
        }

        let x = parseFloat(value);

        if (isNaN(x) || x < 0) {
            return false;
        }

        let taskDefinition: any = {id: this.state.taskDefinition.id};

        taskDefinition[property] = x;

        this.props.onUpdateTaskDefinition(taskDefinition);

        return true;
    };

    render() {
        let taskDefinition = this.state.taskDefinition;

        return (
            <tr>
                <td><DynamicEditField style={columnLimitStyle} initialValue={taskDefinition.name}
                                      acceptFunction={value => this.onAcceptEdit("name", value)}
                                      formatFunction={clickToEditFormatFunction}/></td>
                <td><DynamicEditField style={columnLimitStyle} initialValue={taskDefinition.script}
                                      acceptFunction={value => this.onAcceptEdit("script", value)}
                                      formatFunction={clickToEditFormatFunction}/></td>
                <td>{taskDefinition.interpreter === "none" ? "shell" : taskDefinition.interpreter}</td>
                <td><DynamicEditField style={columnLimitStyle} initialValue={taskDefinition.work_units}
                                      acceptFunction={value => this.onAcceptEdit("work_units", value)}/></td>
                <td><DynamicEditField style={columnLimitStyle} initialValue={taskDefinition.description}
                                      acceptFunction={value => this.onAcceptEdit("description", value)}
                                      formatFunction={clickToEditFormatFunction}/></td>
            </tr>);
    }
}

interface ITaskDefinitionsTable {
    taskDefinitions: ITaskDefinition[];

    updateTaskDefinitionMutation(taskDefinition: ITaskDefinitionInput): Promise<ITaskDefinition>;
}

class TaskDefinitionsTable extends React.Component<ITaskDefinitionsTable, any> {
    public async onUpdateTaskDefinition(taskDefinition: ITaskDefinitionInput) {
        try {
            await this.props.updateTaskDefinitionMutation(taskDefinition);
            console.log("done");
        } catch (err) {
            console.log(err);
        }
    };

    render() {
        let rows = this.props.taskDefinitions.map(taskDefinition => (<TaskDefinitionRow key={"tr_" + taskDefinition.id}
                                                                                        taskDefinition={taskDefinition}
                                                                                        onUpdateTaskDefinition={(task) => this.onUpdateTaskDefinition(task)}/>));
        return (
            <Table striped condensed>
                <thead>
                <tr>
                    <td>Name</td>
                    <td>Script</td>
                    <td>Interpreter</td>
                    <td>Work Units</td>
                    <td>Description</td>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}


const UpdateProjectMutation = gql`
  mutation UpdateTaskDefinitionMutation($taskDefinition: TaskDefinitionInput) {
    updateTaskDefinition(taskDefinition: $taskDefinition) {
      id
      name
      description
      script
      interpreter
      args
      work_units
    }
  }
`;

export const TaskDefinitionTableWithQuery = graphql(UpdateProjectMutation, {
    props: ({mutate}) => ({
        updateTaskDefinitionMutation: (taskDefinition: ITaskDefinitionInput) => mutate({
            variables: {
                taskDefinition: taskDefinition
            }
        })
    })
})(TaskDefinitionsTable);
