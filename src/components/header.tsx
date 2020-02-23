import React from 'react';

import staticAssets from '../config/staticassets';
import '../less/header.less';
import langConfig from '../config/lang';

class Header extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <div id="tl-header">
                {langConfig.appName}
            </div>
        );
    }
}

export default Header;