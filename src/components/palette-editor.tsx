import * as React from "react";

import {Button, Segment, Accordion} from 'semantic-ui-react'
import {Color} from '../utils/color'
import {Palette} from '../utils/palette'
import Dragable from 'react-draggable'

interface PaletteEditorProps{
    palette:Palette
}

interface PaletteEditorState{

}

function ColorComponent(props:{clr:Color, onDragStart:(e:MouseEvent)=>void}) {
    console.log(props, props.clr.hexText())
    let style = {
        width:16,
        height:16,
        display: 'inline-block',
        backgroundColor:props.clr.hexText(),
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: '1px'
    }
    //
    return <Dragable onStart={props.onDragStart} axis='both'><div className='colordiv' style={style}/></Dragable>
}

export class PaletteEditor extends React.Component<PaletteEditorProps, PaletteEditorState> {

    onDragStart(e:MouseEvent) {
        console.log(e)
    }

    render() {
    let groups = this.props.palette.getGroupNames()
    let panels = groups.map(gn=>{
        return {
            key:gn,
            title:gn,
            content:{
                content:<div className="palettegroup">{
                    this.props.palette.getGroupColors(gn).map(clr=><ColorComponent 
                                                                        clr={clr}
                                                                        onDragStart={(e:MouseEvent)=>this.onDragStart(e)}/>)
                }</div>
            }
        }
    })
    return (
        <Dragable cancel=".colordiv">
            <Segment>
                <Accordion panels={panels}/><br/>
                <Button>Add</Button>
            </Segment>
        </Dragable>
        )
    }
}