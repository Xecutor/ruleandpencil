import * as React from "react";

import * as paper from 'paper';

import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

interface RaPRootState {
    modal: boolean;
}

export class RaPRoot extends React.Component<any, any> {
    constructor()
    {
        super();
        this.state = {
        }
        setInterval(()=>this.incCnt(), 1000);
    }

    incCnt()
    {
        this.setState({cnt:this.state.cnt + 1});
    }

    componentDidMount() {
        paper.setup('paperCanvas');
        var path = new paper.Path.Rectangle(new paper.Point(75, 75), new paper.Point(100, 100));
        path.strokeColor = 'black';
        paper.view.draw();
    }
    render() {
        let tt = <Tooltip>Hello world:{this.state.cnt}</Tooltip>;
        return (
            <div className="mainDiv">
                <canvas className="drawCanvas" id="paperCanvas"/>
            </div>
        )
    }
}