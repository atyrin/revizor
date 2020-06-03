import {ServiceClientCredentials, WebResource} from "@azure/ms-rest-js";
import {API_ENDPOINT} from "../AzureTypes";

export class AzRestClient {
    httpClient: WebResource = new WebResource();
    azureCredentials: ServiceClientCredentials

    constructor(azureCredentials: ServiceClientCredentials) {
        this.azureCredentials = azureCredentials;
    }

    get = async (resource: string, apiVersion: string) => {
        return await this.common("GET", resource, apiVersion)
    }

    delete = async (resource: string, apiVersion: string) => {
        return await this.common("DELETE", resource, apiVersion)
    }

    private common = async (method: string, resource: string, apiVersion: string) => {
        this.httpClient = await this.azureCredentials.signRequest(this.httpClient);
        return await performRequest(method, constructUrl(resource, apiVersion), this.httpClient).then(response => response.json())
    }
}

const constructUrl = (resource: string, apiVersion: string) => {
    return `${API_ENDPOINT}/${resource}?api-version=${apiVersion}`
}

const performRequest = async (method: string, url: string, httpClient: WebResource) => {
    const httpClientHeaders: HeadersInit = {};
    httpClient.headers.headersArray().forEach(header => httpClientHeaders[header.name] = header.value)

    return await fetch(url, {

        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: httpClientHeaders,
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        //body: JSON.stringify(data)
    })
}