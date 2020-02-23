import React from 'react';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

import '../less/tierrow.less';
import staticAssets from '../config/staticassets';
import langConfig from '../config/lang';
import TierButton from './tierbutton';

import { TierListItem } from './titem';

import { TierListRow } from '../data/tierrowentry';
import { TierListEntry } from '../data/itementry';

import { Droppable } from 'react-beautiful-dnd';

function isBright(hex)
{
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }

    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 140;
}

function padZero(num: string)
{
    return num.length === 1 ? "0" + num : num;
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    
    let r: number = parseInt(hex.slice(0, 2), 16);
    let g: number = parseInt(hex.slice(2, 4), 16);
    let b: number = parseInt(hex.slice(4, 6), 16);

    if (bw)
    {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 140 ? '#000000' : '#FFFFFF';
    }

    // invert color components
    let invR: string = (255 - r).toString(16);
    let invG: string = (255 - g).toString(16);
    let invB: string = (255 - b).toString(16);

    // pad each with zeros and return
    return "#" + padZero(invR) + padZero(invG) + padZero(invB);
}

class TierRow extends React.Component <{    
    tierRenameCallback: Function,
    tierMoveUpCallback: Function,
    tierMoveDownCallback: Function,
    recolorCallback: Function,
    tierData: TierListRow,
    droppableID: string
}, {
}>
{
    constructor(props)
    {
        super(props);

        this.state = {
            tierName: null
        };
    }

    nameInput(event)
    {
        this.props.tierRenameCallback(this.props.tierData.uid, event.target.innerText);
    }

    onRecolor(color)
    {
        this.props.recolorCallback(this.props.tierData.uid, color.color);
    }

    moveRowUp()
    {
        this.props.tierMoveUpCallback(this.props.tierData.uid);
    }

    moveRowDown()
    {
        this.props.tierMoveDownCallback(this.props.tierData.uid);
    }

    nameFieldKeyPressCb(event)
    {
        if (event.key === 'Enter' || event.key === 'Escape')
        {
            event.target.blur();
        }
    }

    render()
    {
        let controlClasses = `tl-tier-control-item ${isBright(this.props.tierData.color) ? 'tl-tier-control-bright' : 'tl-tier-control-dark' }`;

        return (
            <div className="tl-tier-container">
                <table>
                    <tbody>
                        <tr>
                            <td className="tl-tier-controls" style={{ color: this.props.tierData.color, backgroundColor: invertColor(this.props.tierData.color, true) }}>
                                <div className="tl-tier-controls-container">
                                    <div className={controlClasses} onClick={this.moveRowUp.bind(this)}>
                                        ▲
                                    </div>
                                    <ColorPicker mode="HSB" enableAlpha={false} animation="slide-up" defaultColor={this.props.tierData.color} onChange={this.onRecolor.bind(this)}>
                                        <div className={controlClasses /*+ " react-custom-trigger"*/}>
                                            ⬤
                                        </div>
                                    </ColorPicker>
                                    <div className={controlClasses} onClick={this.moveRowDown.bind(this)}>
                                        ▼
                                    </div>
                                </div>
                            </td>
                            <td className="tl-tier-head" style={{ backgroundColor: this.props.tierData.color, color: invertColor(this.props.tierData.color, true) }}>
                                <span contentEditable={true} suppressContentEditableWarning={true} className="tl-tier-name" onKeyDown={this.nameFieldKeyPressCb.bind(this)} data-placeholder={langConfig.appControls.tierNamePlaceholder} onBlur={this.nameInput.bind(this)}>
                                    {this.props.tierData.tierName}
                                </span>
                            </td>
                            <Droppable droppableId={this.props.droppableID} direction="horizontal">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={{ display: "inline-block" /*getListStyle(snapshot.isDraggingOver)*/ }} >
                                            
                                        {
                                            this.props.tierData.items.map((item, index) => {
                                                return (
                                                    <li key={item.uid}>
                                                        <TierListItem index={index} item={item} />
                                                    </li>
                                                )
                                            })
                                        }

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <td>
                                <ul className="tl-tier">
                                    <li>
                                        <div className="tl-tier-filler"></div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class UnsortedTierRow extends React.Component <{
    addRowItemCallback: (event: any) => void,
    tierItems: Array<TierListEntry>,
    droppableID: string
}, {
}>
{
    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <div className="tl-tier-container">
                <table>
                    <tbody>
                        <tr>
                            <td className="tl-tier-head" style={{ backgroundColor: "black", color: "white" }}>
                                <span className="tl-tier-name">
                                    Unsorted items
                                </span>
                            </td>
                            <td>
                                <ul className="tl-tier">
                                    <Droppable droppableId={this.props.droppableID} direction="horizontal">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={{ display: "inline-block" /*getListStyle(snapshot.isDraggingOver)*/ }} >
                                                    
                                                {
                                                    this.props.tierItems.map((item, index) => {
                                                        return (
                                                            <li key={item.uid}>
                                                                <TierListItem index={index} item={item} />
                                                            </li>
                                                        )
                                                    })
                                                }

                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                    <li>
                                        <TierButton buttonData={{
                                            name: langConfig.appControls.addEntry,
                                            icon: staticAssets.img.menuIcons.addEntry,
                                            callback: this.props.addRowItemCallback
                                        }}/>
                                    </li>
                                    <li>
                                        <div className="tl-tier-filler"></div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export { TierRow, UnsortedTierRow };