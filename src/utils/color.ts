
export type ColorType = "hex" | "rgb" | "hsl" | "unknown"

export function detectColorType(value: string): ColorType {
    if (value.substr(0, 1) === '#') {
        return "hex"
    }
    let prefix = value.substr(0, 3)
    if (prefix === "rgb") {
        return "rgb"
    }
    if (prefix === "hsl") {
        return "hsl"
    }
    return "unknown"
}

function parseValue(valueType:string, valueStr:string):number {
    if(valueType==='x') {
        return parseInt(valueStr, 16)
    }
    if(valueStr==='f') {
        return parseFloat(valueStr)
    }
    return parseInt(valueStr)
}

function parseValueArr(types:string, valueList:string|string[]) :number[] {
    let rv = []
    let values = typeof(valueList)==='string'?valueList.split(','):valueList
    for(let i = 0; i<values.length && i<types.length;++i) {
        rv.push(parseValue(types.substr(i,1), values[i]))
    }
    return rv
}

function rgb2hsl(rgb:number[]) {
    let r = rgb[0] / 255.0
    let g = rgb[1] / 255.0
    let b = rgb[2] / 255.0
    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)
    let h, s
    let l = (max + min) / 2
    if (max == min) {
        h = 0
        s = 0
    }
    else {
        let d = max - min;
        s = (l > 0.5 ? d / (2 - max - min) : d / (max + min))
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6.0;
    }
    return [h, s, l];
}

function hue2rgb(p:number, q:number, t:number) {
    if (t < 0) {
        t += 1
    }
    if (t > 1) {
        t -= 1
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
        return q
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6
    }
    return p
};

function hsl2rgb(hsl:number[]) {
    let l = hsl[2]
    if (hsl[1] == 0) {
        l = Math.round(l * 255)
        return [l, l, l];
    }
    let s = hsl[1]
    let q = (l < 0.5 ? l * (1 + s) : l + s - l * s)
    let p = 2 * l - q;
    let h = hsl[0]
    let r = hue2rgb(p, q, h + 1 / 3);
    let g = hue2rgb(p, q, h);
    let b = hue2rgb(p, q, h - 1 / 3);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function convertComponents(from:ColorType, to:ColorType, components:number[]):number[] {
    if (from === 'hex') {
        from = 'rgb'
    }
    if (to === 'hex') {
        to = 'rgb'
    }
    if (from === to) {
        return components
    }
    let rv
    if(from==='rgb') {
        if (to === 'hsl') {
            rv = rgb2hsl(components)
        }
        else {
            throw new Error("Invalid color conversion target "+to)
        }
    }
    else if(from==='hsl') {
        if(to==='rgb') {
            rv = hsl2rgb(components)
        }
        else {
            throw new Error("Invalid color conversion target "+to)
        }
    } else {
        throw new Error("Unrecognized color conversion source "+to)
    }

    if (components.length == 4) {
        rv.push(components[3])
    }
    return rv
}

const rgbRx = 'rgba?\\((.*)\\)'
const hslRx = 'hsla?\\((.*)\\)'

export class Color{
    colorType : ColorType
    value : string
    components?:{[key in ColorType]?:number[]} = {}
    constructor(value:string, colorType?:ColorType) {
        this.value = value
        if(colorType) {
            this.colorType = colorType
        }
        else {
            
            this.colorType = detectColorType(value)
        }
    }
    getComponents() {
        let rv = this.components[this.colorType]
        if (rv) {
            return rv
        }
        switch (this.colorType) {
            case "hex": {
                if (this.value.length === 7) {
                    rv =parseValueArr('xxx', [1, 3, 5].map(idx => this.value.substr(idx, 2)));
                }
                else {
                    rv = parseValueArr('xxx', [1, 2, 3].map(idx => this.value.substr(idx, 1) + this.value.substr(idx, 1)));
                }
                break
            }
            case "rgb": {
                let m = this.value.match(rgbRx)
                if (!m) {
                    return []
                }
                 rv = parseValueArr('iiif', m[1])
                break
            }
            case 'hsl': {
                let m = this.value.match(hslRx)
                if (!m) {
                    return []
                }
                rv = parseValueArr('iiif', m[1])
                break
            }
            case 'unknown': return []
        }
        this.components[this.colorType] = rv
        return rv
    }
    getComponentsAs(colorType:ColorType) {
        let rv = this.components[colorType]
        if( rv ) {
            return rv
        }
        rv = convertComponents(this.colorType, colorType, this.getComponents())
        this.components[colorType] = rv
        return rv
    }
    rgbText() {
        let rgb = this.getComponentsAs('rgb')
        if(rgb.length==3) {
            let [r,g,b] = rgb
            return `rgb(${r},${g},${b})`
        }
        else {
            let [r,g,b,a] = rgb
            return `rgba(${r},${g},${b},${a})`
        }
    }
    hslText() {
        let hsl = this.getComponentsAs('hsl')
        if(hsl.length==3) {
            let [h,s,l] = hsl
            return `hsl(${h.toPrecision(4)},${s.toPrecision(4)},${l.toPrecision(4)})`
        }
        else {
            let [h,s,l,a] = hsl
            return `hsla(${h.toPrecision(4)},${s.toPrecision(4)},${l.toPrecision(4)},${a.toPrecision(4)})`
        }
    }
    hexText() {
        let rgb = this.getComponentsAs('rgb')
        return '#'+rgb.map(v=>v<16?'0'+v.toString(16):v.toString(16)).join('')
    }
}
