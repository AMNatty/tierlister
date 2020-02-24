export interface IRGBColor
{
    r: number;
    g: number;
    b: number;
}

export function parseHexCode(hexCode: string): IRGBColor
{    
    if (hexCode.charAt(0) === '#')
    {
        hexCode = hexCode.substring(1);
    }

    if (hexCode.length === 3)
    {
        hexCode = hexCode[0] + hexCode[0] + hexCode[1] + hexCode[1] + hexCode[2] + hexCode[2];
    }

    if (hexCode.length !== 6)
    {
        throw new Error('Invalid RGB hex string.');
    }
    
    let r: number = parseInt(hexCode.slice(0, 2), 16);
    let g: number = parseInt(hexCode.slice(2, 4), 16);
    let b: number = parseInt(hexCode.slice(4, 6), 16);

    return { r, g, b };
}

export function invertColor(color: IRGBColor): IRGBColor
{
    return { r: 255 - color.r, g: 255 - color.g, b: 255 - color.b};
}

export function rgbToLuminance(color: IRGBColor): number
{
    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
}

export function rgbToGrayscale(color: IRGBColor): IRGBColor
{
    let luminance: number = rgbToLuminance(color);
    return { r: luminance, g: luminance, b: luminance };
}

export function binaryThreshold(color: IRGBColor, luminance: number): IRGBColor
{
    return rgbToLuminance(color) > luminance ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 };
}

function colorComponentToHexString(value: number): string
{
    return value.toString(16).padStart(2, '0');
}

export function toHex(color: IRGBColor): string
{
    return '#' + colorComponentToHexString(color.r) + colorComponentToHexString(color.g) + colorComponentToHexString(color.b);
}