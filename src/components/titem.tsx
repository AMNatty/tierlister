import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Marquee from 'react-marquee';

import { Draggable } from 'react-beautiful-dnd';

import '../less/tieritem.less';

import { TierListEntry } from '../data/itementry';

class TierListItem extends React.Component<{
    index: number,
    item: TierListEntry
}, {

}>
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <Draggable 
                draggableId={ "item" + this.props.item.uid } 
                index={this.props.index}>
                    
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="tier-item"
                        style={{ backgroundImage: `url('${this.props.item.image}')`, ...provided.draggableProps.style }}>

                        <div className="tier-item-inner">
                            <div className="tier-item-link-container">
                                <a target="_blank" href={this.props.item.videoURL}>
                                    {
                                        this.props.item.name.length > 30 ? 
                                        <Marquee text={ this.props.item.name } />
                                            :
                                        this.props.item.name
                                    }
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }
}

export { TierListItem };