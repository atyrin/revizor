import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {App} from './WebUI/App';
import {initializeIcons} from "office-ui-fabric-react/lib/Icons";


const Main = (): JSX.Element => {
    initializeIcons();
    return (
        <App/>
    )
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);