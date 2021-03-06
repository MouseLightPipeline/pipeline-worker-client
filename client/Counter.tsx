import * as React from "react";
import {Component} from "react";

export default class Counter extends Component<any, any> {
    interval: any;

    constructor(props: any) {
        super(props);
        this.state = {counter: 0};
    }

    componentDidMount() {
        this.interval = setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        this.setState({
            counter: this.state.counter + 1
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                <h2>Counters: {this.state.counter}</h2>
            </div>
        );
    }
}
