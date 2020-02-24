import React from 'react';

import '../less/tierbutton.less'

import { Motion, presets, spring} from 'react-motion';

interface IButtonData
{
    name: string,
    icon: string,
    callback: (event: any) => void
}

class TierButton extends React.Component<{
    buttonData: IButtonData
}, {}>
{
    render()
    {
        return (           
            <div className="tl-tier-button" onMouseDown={event => event.stopPropagation()} key={this.props.buttonData.name} onClick={this.props.buttonData.callback}>
                <img src={this.props.buttonData.icon} alt={this.props.buttonData.name} title={this.props.buttonData.name} />
            </div>
        );
    }
}

export default TierButton;
