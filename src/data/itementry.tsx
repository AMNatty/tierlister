class TierListEntry
{
    uid: number;
    name: string;
    image: string;
    videoURL: string;

    constructor(id: number, name: string, image: string, videoURL: string)
    {
        this.uid = id;
        this.name = name;
        this.image = image;
        this.videoURL = videoURL;
    }
}

export { TierListEntry };