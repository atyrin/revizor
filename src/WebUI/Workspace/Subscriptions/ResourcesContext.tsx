import * as React from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {Subscription, TenantIdDescription} from "@azure/arm-subscriptions/esm/models";
import {SubscriptionSelect} from "./SubscriptionSelect";
import {DirectorySelect} from "./DirectorySelect";
import ItemsStorage from "../../Utils/Storage";
import {getServiceClient} from "../../../AzureService/Account/Login";

interface Props {
    azureClient: ServiceClientCredentials
    setAzureClient: (cred: ServiceClientCredentials) => void;
    currentSubscription: Subscription;
    setSubscription: (sub: Subscription) => void;
}

interface State {
    directory?: TenantIdDescription;
    localAzureClient?: ServiceClientCredentials;
}

export class ResourcesContext extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {}
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const prev = prevState.directory
        const curr = this.state.directory

        if (prev !== curr && (!prev || curr && prev.tenantId !== curr.tenantId)) {
            console.log(`[ResourcesContext] Directory was changed`)
            console.log(`[ResourcesContext] prev tenant id ${prevState.directory ? prevState.directory.tenantId : "was null"}`)
            console.log(`[ResourcesContext] current tenant id ${this.state.directory.tenantId}`)
            recreateAzureClient(this.state.directory, (c) => this.props.setAzureClient(c))
        }
    }

    setDirectory = (d) => {
        this.setState({directory: d})
    }

    render() {
        return (
            <div>
                <DirectorySelect azureClient={this.props.azureClient} currentDirectory={this.state.directory}
                                 setDirectory={d => this.setDirectory(d)}/>
                <SubscriptionSelect azureClient={this.props.azureClient}
                                    currentSubscription={this.props.currentSubscription}
                                    setSubscription={s => this.props.setSubscription(s)}
                                    directory={this.state.directory}/>
            </div>
        )
    }
}


/*
//todo: research hooks complex prevState compare
export const ResourcesContext2: React.FunctionComponent<Props> = (props: Props) => {
    const [directory, setDirectory] = useState<TenantIdDescription>(null);

    useEffect(() => {
        console.log(`[ResourcesContext] Directory changed. Recreate azure client`)
        console.log(`[ResourcesContext] current tenant id ${directory? directory.tenantId : "empty"}`)
        recreateAzureClient(directory, props.setAzureClient)
    }, [directory]);


    return (
        <div>
            <DirectorySelect azureClient={props.azureClient} currentDirectory={directory}
                             setDirectory={d => setDirectory(d)}/>
            <SubscriptionSelect azureClient={props.azureClient} currentSubscription={props.currentSubscription}
                                setSubscription={s => props.setSubscription(s)}/>
        </div>
    )
};*/

const recreateAzureClient = async (directoryId: TenantIdDescription, setLocalAzureClient) => {
    const storage = new ItemsStorage();
    const clientId = storage.getClientId();
    console.log(`[ResourcesContext] call get service client`)
    const credentials: ServiceClientCredentials = await getServiceClient(clientId, directoryId.tenantId)
    setLocalAzureClient(credentials)
}