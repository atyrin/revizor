import * as React from "react";

import {AppBar} from "./AppBar";

import Workspace from "./Workspace/Workspace";
import {AzureUser} from "./AzureUser";
import Login from "./Login/Login";
import {ServiceClientCredentials} from "@azure/ms-rest-js";

interface Props {
}

interface State {
    currentAccount?: AzureUser
    azureClient?: ServiceClientCredentials
}


export default class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <AppBar currentAccount={this.state.currentAccount}
                        logout={() => this.setState({currentAccount: null})}/>
                <Workspace currentAccount={this.state.currentAccount}
                           setAccount={(acc) => this.setState({currentAccount: acc})}
                           azureClient={this.state.azureClient}/>
                <Login currentAccount={this.state.currentAccount}
                       setAccount={(acc) => this.setState({currentAccount: acc})}
                       azureClient={this.state.azureClient}
                       setAzureClient={(client) => this.setState({azureClient: client})}/>
            </div>
        )
    }
}