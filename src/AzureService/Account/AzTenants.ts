import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {AzRestClient} from "../RestClient/AzRestClient";

const API_VERSION = "2020-01-01"
const RESOURCE_NAME = "tenants"

export interface Tenant{
    id: string;
    tenantId: string;
    displayName: string;
    defaultDomain: string;
}

export class AzTenants {
    private readonly client: AzRestClient;

    constructor(credentials: ServiceClientCredentials) {
        this.client = new AzRestClient(credentials);
    }

    list = async (): Promise<Array<Tenant>> => {
        return (await this.client.get(RESOURCE_NAME, API_VERSION))["value"]
    }
}