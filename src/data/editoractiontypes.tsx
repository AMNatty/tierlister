import { ActionType } from './actions';

export interface IAction
{
    type: ActionType;
}

export class AddRowAction implements IAction
{
    type: ActionType;

    constructor()
    {
        this.type = ActionType.ADD_ROW;
    }
}

export class CreateBinItemAction implements IAction
{
    type: ActionType;
    name: string;
    image?: string;
    videoURL?: string;

    constructor(name: string, image?: string, videoURL?: string)
    {
        this.type = ActionType.CREATE_ITEM_BIN;
        this.name = name;
        this.image = image;
        this.videoURL = videoURL;
    }
}

export class RenameRowAction implements IAction
{
    type: ActionType;
    uid: number;
    name: string;

    constructor(uid: number, newName: string)
    {
        this.type = ActionType.RENAME_ROW;
        this.uid = uid;
        this.name = newName;
    }
}

export class MoveRowUpAction implements IAction
{
    type: ActionType;
    uid: number;

    constructor(uid: number)
    {
        this.type = ActionType.MOVE_ROW_UP;
        this.uid = uid;
    }
}

export class MoveRowDownAction implements IAction
{
    type: ActionType;
    uid: number;

    constructor(uid: number)
    {
        this.type = ActionType.MOVE_ROW_DOWN;
        this.uid = uid;
    }
}

export class RecolorRowAction implements IAction
{
    type: ActionType;
    uid: number;
    color: string;

    constructor(uid: number, color: string)
    {
        this.type = ActionType.RECOLOR_ROW;
        this.uid = uid;
        this.color = color;
    }
}

export enum DroppableType
{
    TYPE_ROW,
    TYPE_BIN
}

export interface IDroppable
{
    type: DroppableType;
    itemIndex: number;
    rowIndex?: number;
}

export class TransferItemAction implements IAction
{
    type: ActionType;
    src: IDroppable;
    dest: IDroppable;

    constructor(src: IDroppable, dest: IDroppable)
    {
        this.type = ActionType.TRANSFER_ITEM;
        this.src = src;
        this.dest = dest;
    }
}