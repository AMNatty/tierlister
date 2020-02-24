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

import { rgbToLuminance, parseHexCode, binaryThreshold, invertColor, IRGBColor, toHex } from '../util/colorutil';

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
        const color: IRGBColor = parseHexCode(this.props.tierData.color);
        const threshold: number = 140;
        const foregroundColor: IRGBColor = binaryThreshold(invertColor(color), threshold);

        const controlClasses = `tl-tier-control-item ${rgbToLuminance(color) > threshold ? 'tl-tier-control-bright' : 'tl-tier-control-dark' }`;

        return (
            <div className="tl-tier-container">
                <table>
                    <tbody>
                        <tr>
                            <td className="tl-tier-controls" style={{ color: this.props.tierData.color, backgroundColor: toHex(foregroundColor) }}>
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
                            <td className="tl-tier-head" style={{ backgroundColor: this.props.tierData.color, color: toHex(foregroundColor) }}>
                                <span contentEditable={true} suppressContentEditableWarning={true} className="tl-tier-name" onKeyDown={this.nameFieldKeyPressCb.bind(this)} data-placeholder={langConfig.appControls.tierNamePlaceholder} onBlur={this.nameInput.bind(this)}>
                                    {this.props.tierData.tierName}
                                </span>
                            </td>
                            <Droppable droppableId={this.props.droppableID} direction="horizontal">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={{ display: "inline-block", verticalAlign: "top", /*getListStyle(snapshot.isDraggingOver)*/ }} >
                                            
                                        {
                                            this.props.tierData.items.map((item, index) => {
                                                
                                                return (
                                                    <TierListItem key={item.uid} index={index} item={item} />
                                                )
                                            })
                                        }

                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <td>
                                <div className="tl-tier">
                                    <div className="tl-tier-filler"></div>
                                </div>
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
                                <div className="tl-tier">
                                    <Droppable droppableId={this.props.droppableID} direction="horizontal">
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={{ display: "inline-block" /*getListStyle(snapshot.isDraggingOver)*/ }} >
                                                    
                                                {
                                                    this.props.tierItems.map((item, index) => {
                                                        return (
                                                            <TierListItem key={item.uid} index={index} item={item} />
                                                        )
                                                    })
                                                }

                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                    <TierButton buttonData={{
                                        name: langConfig.appControls.addEntry,
                                        icon: staticAssets.img.menuIcons.addEntry,
                                        callback: this.props.addRowItemCallback
                                    }}/>
                                    <div className="tl-tier-filler"></div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export { TierRow, UnsortedTierRow };
