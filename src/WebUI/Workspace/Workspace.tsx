import * as React from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {Resources} from "./Resources";
import {AzureUser} from "../AzureUser";
import {Subscription} from "@azure/arm-subscriptions/esm/models";
import {SubscriptionSelect} from "./SubscriptionSelect";
import Dashboard from "./Dashboard/Dashboard";
import {Separator} from 'office-ui-fabric-react/lib/Separator';
import {Text} from 'office-ui-fabric-react/lib/Text';

interface Props {
    currentAccount?: AzureUser;
    setAccount: (acc: AzureUser) => void;
    azureClient?: ServiceClientCredentials
}

interface State {
    subscription?: Subscription;
}


export default class Workspace extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log(`Current Account: ${this.props.currentAccount}`)

        if (!this.props.currentAccount) {
            return (
                <Label>Please login....</Label>
            )
        }

        return (
            <div>
                <SubscriptionSelect credentials={this.props.azureClient}
                                    currentSubscription={this.state.subscription}
                                    setSubscription={(s: Subscription) => this.setState({subscription: s})}/>
                <Separator><Text style={textStyle}>Dashboard</Text></Separator>
                <Dashboard credentials={this.props.azureClient} currentSubscription={this.state.subscription}/>

                <Separator><Text style={textStyle}>Reports</Text></Separator>
                <Resources credentials={this.props.azureClient} currentSubscription={this.state.subscription}/>
            </div>

        )
    }
}

const textStyle = {
    fontFamily: 'Monaco, Menlo, Consolas',
    fontSize: '30px'
}