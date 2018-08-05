import {Color} from './color'

class PaletteGroup{
    name:string
    colors:Color[] = []
    constructor(name:string = '') {
        this.name = name
    }
    setName(name:string) {
        this.name = name
    }
    add(color:Color) {
        this.colors.push(color)
    }
    setColors(colors:Color[]) {
        this.colors = colors
    }
}

export class Palette {
    groups:PaletteGroup[] = []
    constructor() {
        let defaultGroup = new PaletteGroup('Default')
        defaultGroup.add(new Color('#000000'))//back
        defaultGroup.add(new Color('#0000FF'))//blue
        defaultGroup.add(new Color('#00FF00'))//green
        defaultGroup.add(new Color('#00FFFF'))//cyan
        defaultGroup.add(new Color('#FF0000'))//red
        defaultGroup.add(new Color('#FF00FF'))//purple
        defaultGroup.add(new Color('#FFFF00'))//yellow
        defaultGroup.add(new Color('#FFFFFF'))//white
        this.groups.push(defaultGroup)
    }
    addGroup(name:string, colors?:Color[]) {
        let group = new PaletteGroup(name)
        if (colors) {
            group.setColors(colors)
        }
        this.groups.push(group)
    }

    findGroupByName(name:string) {
        return this.groups.find(pg=>pg.name==name)
    }

    renameGroup(oldName:string, newName:string) {
        let group = this.findGroupByName(oldName)
        if (group) {
            group.setName(name)
        }
    }
    getGroupNames() {
        return this.groups.map(pg=>pg.name)
    }
    getGroupColors(name:string) {
        let group = this.findGroupByName(name)
        return group ? [...group.colors] : []
    }
}