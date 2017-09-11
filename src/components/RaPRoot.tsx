import * as React from "react";

import * as paper from 'paper';

import {Button, Modal, ProgressBar} from 'react-bootstrap';

interface RaPRootState {
    modal: boolean;
}

export class RaPRoot extends React.Component<any, any> {
    constructor()
    {
        super();
        this.state = {
            modal: false
        }
    }
    componentDidMount() {
        paper.setup('paperCanvas');
        var path = new paper.Path.Rectangle(new paper.Point(75, 75), new paper.Point(100, 100));
        path.strokeColor = 'black';
        paper.view.draw();
    }
    render() {
        return (
            <div>
                <div>
                    <Button bsStyle="primary" bsSize="xsmall" onClick={()=>this.setState({modal:true})}>Extra small button</Button>
                    <ProgressBar active now={45} />
                    <canvas id="paperCanvas"/>
                    <Modal show={this.state.modal} onHide={()=>this.setState({modal:false})}>
                        <Modal.Header>
                            <Modal.Title>Modal title</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            One fine body...
                        </Modal.Body>

                        <Modal.Footer>
                            <Button>Close</Button>
                            <Button bsStyle="primary">Save changes</Button>
                        </Modal.Footer>
                    </Modal>    
                </div>
            </div>
        )
    }
}