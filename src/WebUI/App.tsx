import * as React from "react";
import {useState} from "react";

import {AppBar} from "./AppBar";

import {Workspace} from "./Workspace/Workspace";
import Login from "./Login/Login";
import {AzureUser} from "./AzureUser";
import {ServiceClientCredentials} from "@azure/ms-rest-js";


//todo: handle logout
export const App: React.FunctionComponent = () => {
    const [currentAccount, setCurrentAccount] = useState<AzureUser>(null);
    const [azureClient, setAzureClient] = useState<ServiceClientCredentials>(null);

    return (
        <div>
            <AppBar currentAccount={currentAccount}
                    logout={() => setCurrentAccount(null)}/>
            <Workspace currentAccount={currentAccount}
                       azureClient={azureClient}
                       setAzureClient={(client) => setAzureClient(client)}/>
            <Login currentAccount={currentAccount}
                   setAccount={(acc) => setCurrentAccount(acc)}
                   setAzureClient={(client) => setAzureClient(client)}/>
        </div>
    )
};