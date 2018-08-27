import * as React from "react";

import {Grid, Button, Segment, Accordion, Icon, Input, Divider} from 'semantic-ui-react'
import {Color} from '../utils/color'
import {Palette} from '../utils/palette'
import Dragable from 'react-draggable'

function ColorComponent(props:{clr:Color}) {
    //hello world 123 zxc sdf
    let style = {
        width:'1rem',
        height:'1rem',
        display: 'inline-block',
        backgroundColor:props.clr.hexText(),
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: '1px',
        verticalAlign:'middle'
    }
    //
    return <div className='colordiv' style={style}/>
}

interface AddPaletteGroupWindowProps {
    onConfirm:(name:string)=>void
    onCancel:()=>void
}

interface AddPaletteGroupWindowState {
    name:string
}


class AddPaletteGroupWindow extends React.Component<AddPaletteGroupWindowProps, AddPaletteGroupWindowState> {
    state={
        name:''
    }
    onNameChange({value}:{value:string}) {
        this.setState({name:value})
    }
    boundOnNameChange = this.onNameChange.bind(this)

    onConfirm() {
        this.props.onConfirm(this.state.name)
    }
    boundOnConfirm=this.onConfirm.bind(this)

    render() {
        return <Dragable cancel=".input" defaultPosition={{x:0,y:0}} offsetParent={document.body}>
            <Segment style={{position:'absolute', top:'0px', left:'100px', margin:'0px'}}>
                <Input value={this.state.name} onChange={this.boundOnNameChange}/>
                <Divider/>
                <Button onClick={this.boundOnConfirm}>Add</Button>
                <Button onClick={this.props.onCancel}>Cancel</Button>
            </Segment>
        </Dragable>
    }
}

interface PaletteEditorProps{
    palette:Palette
}

interface PaletteEditorState{
    addVisible:boolean
}

function splitArray<T>(arr:Array<T>, num:number):Array<Array<T>>{
    let rv : Array<Array<T>> = []
    let sz = Math.ceil(arr.length / num)
    for(let i=0;i<sz;++i) {
        rv.push(arr.slice(i*num,(i+1)*num))
    }
    return rv
}

function makeTable<T>(arr:Array<T>, num:number)
{
    let tdStyle={
        margin:0
    }
    return <table>
        <tbody>
        {splitArray(arr, num).map((row,ridx)=><tr key={`row${ridx}`}>{row.map((item,cidx)=><td style={tdStyle} key={`cell${ridx}-${cidx}`}>{item}</td>)}</tr>)}
        </tbody>
    </table>
}

export class PaletteEditor extends React.Component<PaletteEditorProps, PaletteEditorState> {

    state={
        addVisible:false
    }

    onShowAddPaletteGroupWindow() {
        this.setState({addVisible:true})
    }

    boundOnShowAddPaletteGroupWindow=this.onShowAddPaletteGroupWindow.bind(this)

    onAddPalette(name:string) {
        //
        this.setState({addVisible:false})
    }
    boundOnAddPalette=this.onAddPalette.bind(this)

    onCancelAddPalette() {
        this.setState({addVisible:false})
    }
    boundOnCancelAddPalette=this.onCancelAddPalette.bind(this)

    render() {
        let groups = this.props.palette.getGroupNames()

        let panels = groups.map(gn=>{
            return {
                key:gn,
                title:gn,
                content:{
                    content: makeTable([...this.props.palette.getGroupColors(gn).map(
                        clr=><ColorComponent clr={clr}/>
                    ), <Icon style={{verticalAlign:'middle'}}name='plus' circular inverted link size='tiny'/>], 9)
                }
            }
        })
        let rv = [
                <Dragable cancel=".colordiv">
                    <Segment style={{position:'absolute', top:'0px', left:'0px'}}>
                        <Accordion panels={panels}/><br/>
                        <Button disabled={this.state.addVisible} onClick={this.boundOnShowAddPaletteGroupWindow}>Add</Button>
                    </Segment>
                </Dragable>
            ]
        if(this.state.addVisible) {
            rv.push(
                <AddPaletteGroupWindow onCancel={this.boundOnCancelAddPalette} onConfirm={this.boundOnAddPalette}/>
            )
        }
        return rv
    }
}