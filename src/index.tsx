import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import ReactMedia from 'react-media';
import PropTypes from 'prop-types';

import { Provider } from 'react-redux'

import Header from './components/header';
import Footer from './components/footer';
import Editor from './components/editor';

import 'core-js';

import store from './data/rootstore';

import './less/main.less';

class TierListEditorApp extends React.Component
{
    getChildContext()
    {
      return {}
    }

    render()
    {
        return (
            <Provider store={store}>
                <div>
                    <Header />
                    <Editor />
                    <Footer />
                </div>
            </Provider>
        );
    }
}

TierListEditorApp.childContextTypes = {
}

Modal.setAppElement('#appContainer')

ReactDOM.render(<TierListEditorApp />, document.getElementById('appContainer'));