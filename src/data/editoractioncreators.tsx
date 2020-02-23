import { AddRowAction, CreateBinItemAction, RenameRowAction, MoveRowUpAction, MoveRowDownAction, RecolorRowAction, TransferItemAction, IDroppable } from "./editoractiontypes";

export function addRow(): AddRowAction
{
    return new AddRowAction();
}

export function addBinItem(name: string, image?: string, videoURL?: string): CreateBinItemAction
{
    return new CreateBinItemAction(name, image, videoURL);
}

export function renameRow(uid: number, newName: string): RenameRowAction
{
    return new RenameRowAction(uid, newName);
}

export function moveRowUp(uid: number): MoveRowUpAction
{
    return new MoveRowUpAction(uid);
}

export function moveRowDown(uid: number): MoveRowDownAction
{
    return new MoveRowDownAction(uid);
}

export function recolorRow(uid: number, color: string): RecolorRowAction
{
    return new RecolorRowAction(uid, color);
}

export function transferItem(src: IDroppable, dest: IDroppable): TransferItemAction
{
    return new TransferItemAction(src, dest);
}