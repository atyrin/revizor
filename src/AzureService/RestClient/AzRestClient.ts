import {ServiceClientCredentials, WebResource} from "@azure/ms-rest-js";
import {API_ENDPOINT} from "../AzureTypes";

export class AzRestClient {
    httpClient: WebResource = new WebResource();
    azureCredentials: ServiceClientCredentials

    constructor(azureCredentials: ServiceClientCredentials) {
        this.azureCredentials = azureCredentials;
    }

    get = async (resource: string, apiVersion: string) => {
        return await this.common("GET", resource, apiVersion).then(response => response.json())
    }

    delete = async (resource: string, apiVersion: string): Promise<Response> => {
        return await this.common("DELETE", resource, apiVersion)
    }

    private common = async (method: string, resource: string, apiVersion: string): Promise<Response> => {
        this.httpClient = await this.azureCredentials.signRequest(this.httpClient);
        const response = await performRequest(method, constructUrl(resource, apiVersion), this.httpClient)
        if(response.ok) return response;

        const errorBody = (await response.json())["error"]
        throw {
            message: errorBody["message"],
            name: errorBody["code"]
        }
    }
}

const constructUrl = (resource: string, apiVersion: string) => {
    return `${API_ENDPOINT}/${resource}?api-version=${apiVersion}`
}

const performRequest = async (method: string, url: string, httpClient: WebResource): Promise<Response> => {
    const httpClientHeaders: HeadersInit = {};
    httpClient.headers.headersArray().forEach(header => httpClientHeaders[header.name] = header.value)

    return await fetch(url, {

        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: httpClientHeaders,
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        //body: JSON.stringify(data)
    })
}