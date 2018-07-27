import * as React from "react";

import * as paper from 'paper';

import {Button} from 'semantic-ui-react'
import Draggable from 'react-draggable'

interface RaPRootState {
    modal: boolean;
}

export class RaPRoot extends React.Component<any, any> {
    prj : paper.Project;
    canvas: HTMLCanvasElement;
    downAt : paper.Point = null;
    isDown : boolean = false;
    downItem : paper.Item;
    downPos : paper.Point;
    constructor(props:any)
    {
        super(props);
        this.state = {
        }
        setInterval(()=>this.incCnt(), 1000);
    }

    incCnt()
    {
        this.setState({cnt:this.state.cnt + 1});
    }

    eventToPoint(e:React.MouseEvent<HTMLCanvasElement>)
    {
        let x = e.clientX - e.currentTarget.offsetLeft;
        let y = e.clientY - e.currentTarget.offsetTop;
        return new paper.Point(x, y);
    }

    componentDidMount() {
        let prj = new paper.Project(this.canvas);
        this.prj = prj;
        let line = new paper.Path.Rectangle(new paper.Point(0,0), new paper.Point(100,100));
        line.strokeColor = 'rgba(0, 0, 0, 0.5)';
        line.strokeWidth = 0.5;
        let gridLayer = new paper.Layer;

        let path = new paper.Path.Rectangle(new paper.Point(75, 75), new paper.Point(100, 100));
        path.strokeColor = 'black';
        this.prj.activeLayer.addChild(path);
        this.prj.activate();
    }

    click() {
        let path = new paper.Path.Rectangle(new paper.Point(175, 175), new paper.Point(200, 200));
        path.strokeColor = 'black';
        path = new paper.Path.Circle(new paper.Point(275, 275), 50);
        path.strokeColor = 'black';
    }

    onCanvasMouseDown(e:React.MouseEvent<HTMLCanvasElement>)
    {
        let p = this.eventToPoint(e);
        this.downAt = p;
        this.isDown = true;
        this.downItem = null;
        for(let c of this.prj.activeLayer.children) {
            if(c.contains(p)) {
                this.downItem = c;
                this.downPos = c.position.clone();
                break;
            }
        }
    }

    onCanvasMouseUp(e:React.MouseEvent<HTMLCanvasElement>)
    {
        this.isDown = false;
    }

    onCanvasMouseMove(e:React.MouseEvent<HTMLCanvasElement>)
    {
        let p = this.eventToPoint(e);
        for(let c of this.prj.activeLayer.children) {
            if(c.className === 'Path') {
                let path = c as paper.Path;
                path.selected=false;
                let np = path.getNearestPoint(p);
                if(np.getDistance(p)<10) {
                    let pp = path.getLocationOf(np);
                    if(pp) {
                        pp.segment.selected = true;
                        console.log(pp.point.selected);
                        pp.point.selected = true;
                    }
                }
            }
            /*if(c.contains(p)) {
                c.selected = true;
            }
            else {
                c.selected = false;
            }*/
        }
        if(this.isDown && this.downItem) {
            let delta = p.subtract(this.downAt);
            this.downItem.position = this.downPos.add(delta);
        }
    }

    render() {
        return (
            <div className="mainDiv debugBorder">
                <Draggable>
                    <span className="debugBorder">
                        <Button onClick={()=>this.click()}>Click</Button>
                    </span>
                </Draggable>
                <canvas 
                    className="drawCanvas" 
                    ref={(canvas)=>this.canvas=canvas} 
                    onMouseDown={(e)=>this.onCanvasMouseDown(e)}
                    onMouseUp={(e)=>this.onCanvasMouseUp(e)}
                    onMouseMove={(e)=>this.onCanvasMouseMove(e)}/>
            </div>
        )
    }
}