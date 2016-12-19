import * as React from "react";

import {
    Grid,
    Row,
    Col,
    Panel,
    Button,
    DropdownButton,
    MenuItem,
    FormGroup,
    ControlLabel,
    FormControl,
    Glyphicon,
    HelpBlock
} from "react-bootstrap";


class StartTaskMenu extends React.Component<any, any> {
    handleChange = (eventKey) => {
        this.props.onTaskSelectionChange(eventKey);
    };

    render() {
        let divStyle = {
            width: "100%",
        };

        let title = "";

        let rows = this.props.taskDefinitions.map(taskDefinition => {
            if (taskDefinition.id === this.props.selectedTaskId) {
                title = taskDefinition.name;
            }

            return (<MenuItem style={divStyle} key={taskDefinition.id} eventKey={taskDefinition.id}>{taskDefinition.name}</MenuItem>)
        });

        return (
            <div style={divStyle}>
                <DropdownButton style={divStyle} id="task-definition-dropdown" bsSize="sm" title={title} onSelect={this.handleChange}>
                    {rows}
                </DropdownButton>
            </div>
        )
    }
}

class StartTaskButton extends React.Component<any, any> {
    onClick = () => {
        this.props.startTask(this.props.selectedTaskDefinitionId, this.props.scriptArgs);
    };

    render() {
        return (<Button bsStyle="success" bsSize="sm" onClick={this.onClick}><Glyphicon glyph="play"/> Start</Button>)
    }
}

interface IStartTaskComponentState {
    selectedTaskDefinitionId?: string;
    scriptArgString?: string;
    scriptArgs?: string[];
}

export class TaskStartComponent extends React.Component<any, IStartTaskComponentState> {
    constructor(props) {
        super(props);
        this.onTaskSelectionChange = this.onTaskSelectionChange.bind(this);
        this.state = {selectedTaskDefinitionId: "", scriptArgString: "", scriptArgs: []};
    }

    public onTaskSelectionChange(selectedTaskId: any) {
        this.setState({selectedTaskDefinitionId: selectedTaskId}, null);
    }

    onTaskArgumentsChange = (event: any) => {
        this.setState({
            scriptArgString: event.target.value,
            scriptArgs: event.target.value.split(/[\s+]/).filter(Boolean)
        }, null);
    };

    render() {
        if (this.state.selectedTaskDefinitionId === "" && this.props.taskDefinitions.length > 0) {
            this.state.selectedTaskDefinitionId = this.props.taskDefinitions[0].id;
        }

        let divStyle = {
            width: "100%",
        };

        return (
            <Panel collapsible defaultExpanded header="Start New Task" bsStyle="info">
                <Grid fluid>
                    <Row>
                        <Col lg={1}>
                            <FormGroup>
                                <ControlLabel>&nbsp;</ControlLabel><br/>
                                <StartTaskButton
                                    selectedTaskDefinitionId={this.state.selectedTaskDefinitionId}
                                    scriptArgs={this.state.scriptArgs} startTask={this.props.startTask}/>
                            </FormGroup>
                        </Col>
                        <Col lg={2} >
                            <FormGroup style={divStyle}>
                                <ControlLabel>Task</ControlLabel>
                                <StartTaskMenu onTaskSelectionChange={this.onTaskSelectionChange}
                                               taskDefinitions={this.props.taskDefinitions}
                                               selectedTaskId={this.state.selectedTaskDefinitionId}/>
                            </FormGroup>
                        </Col>
                        <Col lg={9}>
                            <FormGroup>
                                <ControlLabel>Arguments</ControlLabel>
                                <FormControl type="text" onChange={this.onTaskArgumentsChange}
                                             value={this.state.scriptArgString}/>
                                <HelpBlock>
                                    Tasks assume the following initial arguments: pipeline name, pipeline root path, previous stage root path, current stage root path, tile relative path, tile id, channel.<br/>
                                    Tasks may require additional task-specific arguments.
                                </HelpBlock>
                            </FormGroup>
                        </Col>
                    </Row>
                </Grid>
            </Panel>)
    }
}

