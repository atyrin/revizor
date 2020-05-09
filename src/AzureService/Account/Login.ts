import {ServiceClientCredentials, HttpHeaders} from "@azure/ms-rest-js";
import * as Msal from "msal";

import {AZURE_AUTHENTICATION_SCOPE, AZURE_TOKEN_SCOPE, AZURE_DEFAULT_AUTHORITY_URL} from "../AzureTypes"

//todo: handle reject
const createCredentials = (token: string): ServiceClientCredentials => {
    return ({
        signRequest: (req) => {
            return new Promise((resolve, reject) => {
                if (!req.headers)
                    req.headers = new HttpHeaders();
                req.headers.set("Authorization", "Bearer " + token);
                resolve(req);
            })
        }
    })
}


const acquireToken = async (msalInstance: Msal.UserAgentApplication, account: Msal.Account, tenantId: string = null): Promise<ServiceClientCredentials> => {
    const currentAuthority = getAuthorityUrl(tenantId);
    console.log(`Acquire token for authority: ${currentAuthority}`)
    const tokenRequest: Msal.AuthenticationParameters = {
        authority: currentAuthority,
        scopes: AZURE_TOKEN_SCOPE,
        sid: account.sid
    };

    msalInstance.handleRedirectCallback((error, response) => {
        console.warn("Acquire token redirect handler")
        if (error) {
            console.log("Error during token acquire")
            console.error(error)
            return
        }
        return createCredentials(response.accessToken)
    });

    try {
        console.log("Starting silent token acquiring...")
        const response = await msalInstance.acquireTokenSilent(tokenRequest)
        console.log("Token was successfully acquired silently")
        return createCredentials(response.accessToken)
    } catch (err) {
        console.error("Failed to acquire token silently")
        console.error(err)
        if (err.name === "InteractionRequiredAuthError" || err.name === "consent_required") {
            console.warn("Perform redirect for token acquire")
            msalInstance.acquireTokenRedirect(tokenRequest)
        }
    }
}


const performLogin = async (msalInstance: Msal.UserAgentApplication) => {
    const loginRequest: Msal.AuthenticationParameters = {
        scopes: AZURE_AUTHENTICATION_SCOPE
    };

    try {
        console.log("Start authentication process in popup windows")
        const response = await msalInstance.loginPopup(loginRequest);
        console.log(`User ${response.account.userName} was successfully authenticated`)
        return await acquireToken(msalInstance, response.account);
    } catch (err) {
        console.error("Failed to authenticate user")
    }
}

const getMsalInstance = (appId: string, tenantId: string): Msal.UserAgentApplication => {
    const msalConfig: Msal.Configuration = {
        auth: {
            clientId: appId,
            authority: getAuthorityUrl(tenantId)
        }
    };
    return new Msal.UserAgentApplication(msalConfig);
}

const getAuthorityUrl = (tenantId: string) => {
    const authorityResource = tenantId ? tenantId : "common"
    return AZURE_DEFAULT_AUTHORITY_URL + authorityResource
}

export const getServiceClient = async (appId: string, tenantId: string): Promise<ServiceClientCredentials> => {
    console.log(`Create Azure client for tenantId: ${tenantId}, appId: ${appId}`)
    const msalInstance: Msal.UserAgentApplication = getMsalInstance(appId, tenantId)
    if (msalInstance.getAccount()) {
        const account = msalInstance.getAccount()
        return await acquireToken(msalInstance, account, tenantId);
    }
    return await performLogin(msalInstance)
}

export const getCurrentAccount = (appId: string, tenantId: string): Msal.Account => {
    return getMsalInstance(appId, tenantId).getAccount()
}