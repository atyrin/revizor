import * as React from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {Subscription} from "@azure/arm-subscriptions/esm/models";
import {SubscriptionSelect} from "./SubscriptionSelect";
import {DirectorySelect} from "./DirectorySelect";
import ItemsStorage from "../../Utils/Storage";
import {getServiceClient} from "../../../AzureService/Account/Login";
import {Tenant} from "../../../AzureService/Account/AzTenants";

interface Props {
    azureClient: ServiceClientCredentials;
    setAzureClient: (cred: ServiceClientCredentials) => void;
    currentSubscription: Subscription;
    setSubscription: (sub: Subscription) => void;
}

interface State {
    directory?: Tenant;
    localAzureClient?: ServiceClientCredentials;
}

const recreateAzureClient = async (directoryId: Tenant): Promise<ServiceClientCredentials> => {
    const storage = new ItemsStorage();
    const clientId = storage.getClientId();
    console.log(`[ResourcesContext] call get service client for ${directoryId.tenantId}`)
    return await getServiceClient(clientId, directoryId.tenantId)
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
            recreateAzureClient(this.state.directory).then(client => this.props.setAzureClient(client))
        }
    }

    setDirectory = (d) => {
        this.setState({directory: d})
    }

    render() {
        return (
            <div style={{backgroundColor: "#f5f5f5", margin: 20, padding: 10, boxShadow: "5px 5px 5px 0px rgba(232,229,232,1)"}}>
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


