import { TierListEntry } from './itementry';

class TierListRow
{
    uid: number;
    tierName: string;
    items: Array<TierListEntry>;
    color: string;

    constructor(id: number, name: string, color: string)
    {
        this.uid = id;
        this.tierName = name;
        this.items = [];
        this.color = color;
    }
}

export { TierListRow };