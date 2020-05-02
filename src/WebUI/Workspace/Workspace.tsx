import * as React from "react";
import {useState} from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {Resources} from "./Resources";
import {AzureUser} from "../AzureUser";
import Dashboard from "./Dashboard/Dashboard";
import {Separator} from 'office-ui-fabric-react/lib/Separator';
import {Text} from 'office-ui-fabric-react/lib/Text';
import {ResourcesContext} from "./Subscriptions/ResourcesContext";
import {Subscription} from "@azure/arm-subscriptions/esm/models";

interface Props {
    currentAccount?: AzureUser;
    azureClient?: ServiceClientCredentials
    setAzureClient: (client: ServiceClientCredentials) => void;
}

export const Workspace: React.FunctionComponent<Props> = (props: Props) => {
    const [subscription, setSubscription] = useState<Subscription>(null);

    if (!props.currentAccount) {
        return (
            <Label>Please login....</Label>
        )
    }

    return (
        <div>
            <ResourcesContext azureClient={props.azureClient} setAzureClient={client => props.setAzureClient(client)}
                              currentSubscription={subscription} setSubscription={s => setSubscription(s)}/>
            <Separator><Text style={textStyle}>Dashboard</Text></Separator>
            <Dashboard credentials={props.azureClient} currentSubscription={subscription}/>

            <Separator><Text style={textStyle}>Reports</Text></Separator>
            <Resources credentials={props.azureClient} currentSubscription={subscription}/>
        </div>
    )
};


const textStyle = {
    fontFamily: 'Monaco, Menlo, Consolas',
    fontSize: '30px'
}