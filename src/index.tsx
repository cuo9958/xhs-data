import React from 'react';
import { render } from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import stores from './models';
import Routes from './routes';

import './index.less';
import 'rsuite/dist/styles/rsuite-default.css';

class App extends React.Component {
    render() {
        return (
            <Provider {...stores}>
                <HashRouter>
                    <Routes />
                </HashRouter>
            </Provider>
        );
    }
}

render(<App />, document.getElementById('root'));

