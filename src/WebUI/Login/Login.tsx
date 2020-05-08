import * as React from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {getCurrentAccount, getServiceClient} from "../../AzureService/Account/Login";
import {AzureUser} from "../AzureUser";
import {LoginModal} from "./LoginModal";
import ItemsStorage from "../Utils/Storage";

interface Props {
    currentAccount?: AzureUser;
    setAccount: (acc: AzureUser) => void;
    setAzureClient: (client: ServiceClientCredentials) => void;
}

interface State {
    clientId?: string;
    tenantId?: string;
    isInitiateDone: boolean;
}


export default class Login extends React.Component<Props, State> {
    storage: ItemsStorage;

    constructor(props: Props) {
        super(props);
        this.storage = new ItemsStorage();
        this.state = {
            clientId: this.storage.getClientId(),
            tenantId: this.storage.getTenantId(),
            isInitiateDone: false
        }
    }

    componentDidMount() {
        this.initiateClient();
    }

    private initiateClient = async () => {
        const account = getCurrentAccount(this.state.clientId, this.state.tenantId)
        if (account) {
            this.props.setAccount({username: account.name, email: account.userName})

            console.log(`User ${account.userName} already logged in. Create azure client`)
            const credentials: ServiceClientCredentials = await getServiceClient(this.state.clientId, this.state.tenantId)
            this.props.setAzureClient(credentials)
        }
        this.setState({isInitiateDone: true})
    }

    private createAzureClient = async () => {
        const credentials: ServiceClientCredentials = await getServiceClient(this.state.clientId, this.state.tenantId)
        this.props.setAzureClient(credentials)

        const account = getCurrentAccount(this.state.clientId, this.state.tenantId)
        this.props.setAccount({username: account.name, email: account.userName})

    }

    private updateClientId = (id: string) => {
        this.setState({clientId: id});
        this.storage.setClientId(id);
    }

    private updateTenantId = (id: string) => {
        this.setState({tenantId: id});
        this.storage.setTenantId(id);
    }

    render() {
        const isUserAuthenticated = Boolean(this.props.currentAccount);

        return (
            <LoginModal isModalOpen={!isUserAuthenticated && this.state.isInitiateDone}
                        closeModal={() => console.log("Try to close login")}
                        tenantId={this.state.tenantId} clientId={this.state.clientId}
                        updateTenantId={(id) => this.updateTenantId(id)}
                        updateClientId={(id) => this.updateClientId(id)}
                        triggerAuth={() => this.createAzureClient()}/>
        )
    }
}