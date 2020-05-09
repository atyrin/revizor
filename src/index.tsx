import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './WebUI/App';
import {initializeIcons} from "office-ui-fabric-react/lib/Icons";
import {HashRouter as Router,} from "react-router-dom";


const Main = (): JSX.Element => {
    initializeIcons();
    return (
        <Router>
            <App/>
        </Router>
    )
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);