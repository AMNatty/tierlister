import React from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

import staticAssets from '../config/staticassets';
import '../less/editor.less';
import '../less/tierrow.less';

import * as EditorActionCreators from '../data/editoractioncreators';

import { DragDropContext } from 'react-beautiful-dnd';

import langConfig from '../config/lang';

import TierButton from './tierbutton';
import { TierRow, UnsortedTierRow } from './tierrow';

import AddItemModal from './additemmodal';
import { IState } from '../data/rootstore';

import { AddRowAction, IDroppable, MoveRowDownAction, MoveRowUpAction, RenameRowAction, TransferItemAction, CreateBinItemAction, RecolorRowAction, DroppableType } from '../data/editoractiontypes';


const rowDroppableIDPrefix = "row";
const binDroppableID = "unusedBin";

class Editor extends React.Component<{
    tierlist: IState,
    addRow: () => AddRowAction
    addBinItem(name: string, image?: string, videoURL?: string): CreateBinItemAction
    renameRow(uid: number, newName: string): RenameRowAction
    moveRowUp(uid: number): MoveRowUpAction
    moveRowDown(uid: number): MoveRowDownAction
    recolorRow(uid: number, color: string): RecolorRowAction
    transferItem(src: IDroppable, dest: IDroppable): TransferItemAction
}, {
    scrolling: boolean,
    xScroll: number,
    yScroll: number,
    xPosLast: number,
    yPosLast: number
}>
{
    addItemModalRef: React.RefObject<AddItemModal>;

    constructor(props)
    {
        super(props);

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);

        this.state = {
            xScroll: 0,
            yScroll: 0,
            xPosLast: 0,
            yPosLast: 0,
            scrolling: false
        };
        
        this.addItemModalRef = React.createRef();
    }

    componentDidMount()
    {
        window.addEventListener('blur', this.mouseUpHandler);
    }

    componentWillUnmount()
    {
        window.removeEventListener('blur', this.mouseUpHandler);
    }

    mouseMoveHandler(event)
    {
        let x = event.clientX;
        let y = event.clientY;

        this.setState({
            xPosLast: x,
            yPosLast: y
        });

        if (!this.state.scrolling)
        {
            return;
        }

        this.setState({
            xScroll: this.state.xScroll + x - this.state.xPosLast,
            yScroll: this.state.yScroll + y - this.state.yPosLast
        });
    }

    mouseDownHandler(event)
    {
        let x = event.clientX;
        let y = event.clientY;

        this.setState({
            xPosLast: x,
            yPosLast: y,
            scrolling: true
        });
    }

    mouseUpHandler(/*event*/)
    {
        this.setState({
            scrolling: false
        });
    }

    openAddModal()
    {
        this.addItemModalRef.current.openModal();
    }

    onDragEnd(result) 
    {
        const { source, destination } = result;

        if (!destination)
        {
            return;
        }

        let src: IDroppable;
        let dest: IDroppable;

        if (source.droppableId === binDroppableID) // Bin to ???
        {
            src = {
                type: DroppableType.TYPE_BIN,
                itemIndex: source.index
            };
        }
        else // Row to ???
        {
            src = {
                type:  DroppableType.TYPE_ROW,
                rowIndex: parseInt(source.droppableId.substring(rowDroppableIDPrefix.length)),
                itemIndex: source.index
            };
        }

        if (destination.droppableId === binDroppableID) // ??? to bin
        {
            dest = {
                type: DroppableType.TYPE_BIN,
                itemIndex: destination.index
            };
        }
        else // ??? to row
        {
            dest = {
                type: DroppableType.TYPE_ROW,
                rowIndex: parseInt(destination.droppableId.substring(rowDroppableIDPrefix.length)),
                itemIndex: destination.index
            };
        }

        this.props.transferItem(src, dest);
    };

    render() {
        var zthis = this;
        return (
            <div
                className='tl-editor'
                onMouseDown={this.mouseDownHandler}
                onMouseUp={this.mouseUpHandler}
                onMouseLeave={this.mouseUpHandler}
                onMouseMove={this.mouseMoveHandler}>
                
                <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                    {this.props.tierlist.rows.map((row, rowIndex) => {
                        return (
                            <Motion key={row.uid} defaultStyle={{x: 0}} style={{x: spring(1, {stiffness: 200, damping: 15})}}>
                                {
                                    value => (
                                        <div style={{ transformOrigin: "50% 0%", transform: `scaley(${value.x})`}}>
                                            <TierRow
                                                droppableID={rowDroppableIDPrefix + rowIndex}
                                                tierData={row}
                                                tierRenameCallback={zthis.props.renameRow}
                                                tierMoveUpCallback={zthis.props.moveRowUp}
                                                tierMoveDownCallback={zthis.props.moveRowDown}
                                                recolorCallback={zthis.props.recolorRow} />
                                        </div>
                                    )
                                }
                            </Motion>
                        )
                    })}
                    <TierButton buttonData={{
                            name: langConfig.appControls.addRow,
                            icon: staticAssets.img.menuIcons.addRow,
                            callback: this.props.addRow
                    }}/>

                    <UnsortedTierRow droppableID={ binDroppableID } tierItems={this.props.tierlist.unusedPool} addRowItemCallback={this.openAddModal.bind(this)} />
                </DragDropContext>

                <AddItemModal ref={this.addItemModalRef} addItemCallBack={this.props.addBinItem} />
            </div>
        );
    }
}

const mapStateToProps = (state/*, ownProps*/) => {
    return {
        tierlist: state
    };
};

export default connect(
    mapStateToProps,
    EditorActionCreators
)(Editor);