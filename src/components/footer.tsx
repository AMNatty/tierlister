import React from 'react' ;

import langConfig from '../config/lang';
import links from '../config/links';

import '../less/footer.less';

class Footer extends React.Component
{
    render() {
        return (
            <div id="tl-footer">
                <span className="tl-heading">
                    {langConfig.appName}
                </span>
                {langConfig.version}
                {links.map(website => {
                    return (
                        <a href={website.url} key={website.name} className='tl-smallink'>
                            {website.name}
                        </a>
                    );
                })}
            </div>
        );
    }
}

export default Footer;
