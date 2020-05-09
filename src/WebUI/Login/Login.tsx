import * as React from "react";
import {useEffect, useState} from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {getCurrentAccount, getServiceClient} from "../../AzureService/Account/Login";
import {AzureUser} from "../AzureUser";
import {LoginModal} from "./LoginModal";
import ItemsStorage from "../Utils/Storage";
import {useQuery} from "../Utils/UrlQueryHook";
import {APPLICATION_ID_QUERY_PARAM} from "../Model/QueryParameters";
import {isValidGuid} from "../Utils/Validators";


interface Props {
    currentAccount?: AzureUser;
    setAccount: (acc: AzureUser) => void;
    setAzureClient: (client: ServiceClientCredentials) => void;
}

const loadLoginParameters = (storage: ItemsStorage): [string, string] => {
    const clientId = storage.getClientId();
    const tenantId = storage.getTenantId();
    return [clientId, tenantId]
}


export const Login: React.FunctionComponent<Props> = (props: Props) => {
    const storage = new ItemsStorage();
    const [storedClientId, storedTenantId] = loadLoginParameters(storage);
    const [tenantId, setTenantId] = useState<string>(storedTenantId);
    const [clientId, setClientId] = useState<string>(storedClientId);

   const urlClientId = useQuery().get(APPLICATION_ID_QUERY_PARAM);
   console.log(`[Login] URL query client id: ${urlClientId}`)

    useEffect(() => {
        console.log(`[Login] URL param ClientId was changed. Prev: ${clientId}, new: ${urlClientId}`)
        if (isValidGuid(urlClientId)) {
            storage.setClientId(urlClientId)
            setClientId(urlClientId)
        }
    }, [urlClientId])

    useEffect(() => {
        console.log(`[Login] ClientId state was changed. Recreate client`)
        const account = getCurrentAccount(clientId, tenantId)
        if (account) {
            props.setAccount({username: account.name, email: account.userName})

            console.log(`[Login] User ${account.userName} already logged in. Create azure client`)
            getServiceClient(clientId, tenantId).then((client) => props.setAzureClient(client))
        }
    }, [clientId])


    const createAzureClient = async () => {
        const credentials: ServiceClientCredentials = await getServiceClient(clientId, tenantId)
        props.setAzureClient(credentials)

        const account = getCurrentAccount(clientId, tenantId)
        props.setAccount({username: account.name, email: account.userName})
    }

    const updateClientId = (id: string) => {
        setClientId(id)
        if (isValidGuid(id)) storage.setClientId(id);
    }

    const updateTenantId = (id: string) => {
        setTenantId(id)
        if (isValidGuid(id)) storage.setTenantId(id);
    }


    const shouldShowAuthParametersForm = !Boolean(props.currentAccount);

    return (
        <LoginModal isModalOpen={shouldShowAuthParametersForm}
                    closeModal={() => console.log("Try to close login")}
                    tenantId={tenantId} clientId={clientId}
                    updateTenantId={(id) => updateTenantId(id)}
                    updateClientId={(id) => updateClientId(id)}
                    triggerAuth={() => createAzureClient()}/>
    )
}