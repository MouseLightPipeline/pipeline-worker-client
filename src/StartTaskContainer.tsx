import * as React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Button, DropdownButton, MenuItem} from "react-bootstrap";


class StartTaskMenu extends React.Component<any, any> {
    handleChange = (eventKey) => {
        this.props.onTaskSelectionChange(eventKey);
    };

    render() {
        let title ="";

        let rows = this.props.taskDefinitions.map(taskDefinition => {
            if (taskDefinition.id === this.props.selectedTaskId) {title = taskDefinition.name;}

            return (<MenuItem key={taskDefinition.id} eventKey={taskDefinition.id}>{taskDefinition.name}</MenuItem>)
        });

        return (
            <div>
                <DropdownButton id="task-definition-dropdown" title={title} onSelect={this.handleChange}>
                    {rows}
                </DropdownButton>
            </div>
        )
    }
}

class StartTaskButton extends React.Component<any, any> {
    onClick() {
        this.props.mutate({variables: {taskDefinitionId: this.props.selectedTaskDefinitionId}})
        .then(({data}) => {
            console.log('got data', data);
        }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    }

    render() {
        return (<Button bsStyle="primary" onClick={this.onClick.bind(this)}>Start</Button>)
    }
}

interface IStartTaskComponentState {
    selectedTaskDefinitionId: string;
}

export class StartTaskComponent extends React.Component<any, IStartTaskComponentState> {
    constructor(props) {
        super(props);
        this.onTaskSelectionChange = this.onTaskSelectionChange.bind(this);
        this.state = {selectedTaskDefinitionId: ""};
    }

    public onTaskSelectionChange(selectedTaskId: any) {
        this.setState({selectedTaskDefinitionId: selectedTaskId}, null);
    }

    render() {
        if (this.state.selectedTaskDefinitionId === "" && this.props.taskDefinitions.length > 0) {
            this.state.selectedTaskDefinitionId = this.props.taskDefinitions[0].id;
        }

        return (
            <div>
                <div>
                    <StartTaskMenu onTaskSelectionChange={this.onTaskSelectionChange}
                                   taskDefinitions={this.props.taskDefinitions}
                                   selectedTaskId={this.state.selectedTaskDefinitionId}/>
                </div>
                <div>
                    <StartTaskButtonWithMutation selectedTaskDefinitionId={this.state.selectedTaskDefinitionId}/>
                </div>
            </div>)
    }
}

const startTaskMutation = gql`
  mutation StartTaskMutation($taskDefinitionId: String!) {
    startTask(taskDefinitionId:$taskDefinitionId) {
      id
    }
  }
`;

const StartTaskButtonWithMutation = graphql(startTaskMutation)(StartTaskButton);
