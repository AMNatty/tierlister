import { createStore, Store, bindActionCreators, applyMiddleware } from 'redux';
import { ActionType } from './actions';
import { TierListEntry } from './itementry';
import { TierListRow } from './tierrowentry';
import { IAction, RenameRowAction, RecolorRowAction, CreateBinItemAction, MoveRowUpAction, MoveRowDownAction, TransferItemAction, DroppableType } from './editoractiontypes';

function getRandomColor(): string
{
    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++)
    {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

export interface IState
{
    nextRowID: number,
    nextItemID: number,
    rows: Array<TierListRow>,
    unusedPool: Array<TierListEntry>
}

function editorTransform(state: IState = {
    nextRowID: 1,
    nextItemID: 1,
    rows: [],
    unusedPool: []
}, actionObject: object)
{
    let action = actionObject as IAction;

    switch (action.type)
    {
        case ActionType.ADD_ROW:
        {
            return { 
                ...state,
                nextRowID: state.nextRowID + 1,
                rows: [
                    ...state.rows,
                    new TierListRow(state.nextRowID, "", getRandomColor())
                ]
            };
        }
        case ActionType.RENAME_ROW:
        {
            let act = action as RenameRowAction;

            let newState = { ...state };
            let row = newState.rows.find(row => row.uid === act.uid);

            if (row)
            {
                row.tierName = act.name;
            }

            return newState;
        }
        case ActionType.RECOLOR_ROW:
        {
            let act = action as RecolorRowAction;

            let newState = { ...state };
            let row = newState.rows.find(row => row.uid === act.uid);

            if (row)
            {
                row.color = act.color;
            }

            return newState;
        }
        case ActionType.CREATE_ITEM_BIN:
        {
            let act = action as CreateBinItemAction;

            let newState = { ...state };
            let itemID = newState.nextItemID++;
           
            let entry = new TierListEntry(itemID, act.name, act.image, act.videoURL);

            newState.unusedPool.push(entry);

            return newState;
        }
        case ActionType.MOVE_ROW_UP:
        {
            let act = action as MoveRowUpAction;

            let newState = { ...state };
            let itemIdx = state.rows.findIndex(row => row.uid == act.uid);

            if (itemIdx === -1 || itemIdx === 0)
            {
                return newState;
            }
 
            let tmp = newState.rows[itemIdx];
            newState.rows[itemIdx] = newState.rows[itemIdx - 1];
            newState.rows[itemIdx - 1] = tmp;

            return newState;
        }
        case ActionType.MOVE_ROW_DOWN:
        {
            let act = action as MoveRowDownAction;

            let newState = { ...state };
            let itemIdx = state.rows.findIndex(row => row.uid == act.uid);

            if (itemIdx === -1 || itemIdx === state.rows.length - 1)
            {
                return newState;
            }
 
            let tmp = newState.rows[itemIdx];
            newState.rows[itemIdx] = newState.rows[itemIdx + 1];
            newState.rows[itemIdx + 1] = tmp;

            return newState;
        }
        case ActionType.TRANSFER_ITEM:
        {
            let act = action as TransferItemAction;

            let newState = { ...state };

            let removedItem: TierListEntry;

            if (act.src.type === DroppableType.TYPE_BIN)
            {
                removedItem = newState.unusedPool.splice(act.src.itemIndex, 1)[0];

                if (act.dest.type === DroppableType.TYPE_BIN && act.dest.itemIndex > act.src.rowIndex)
                {
                    act.dest.itemIndex--;
                }
            }
            else
            {
                removedItem = newState.rows[act.src.rowIndex].items.splice(act.src.itemIndex, 1)[0];

                if (act.dest.type === DroppableType.TYPE_ROW && act.dest.rowIndex === act.src.rowIndex && act.dest.itemIndex > act.src.rowIndex)
                {
                    act.dest.itemIndex--;
                }
            }

            if (act.dest.type === DroppableType.TYPE_BIN)
            {
                newState.unusedPool.splice(act.dest.itemIndex, 0, removedItem);
            }
            else
            {
                console.log(act.dest);
                newState.rows[act.dest.rowIndex].items.splice(act.dest.itemIndex, 0, removedItem);
            }
        }

        default:
            return state;
    }
}

function classObjectizer(store)
{
    return function(next)
    {
        return function(action)
        {
            return next({...action});
        }
    }
}

const store: Store = createStore(editorTransform, applyMiddleware(classObjectizer));

export default store;