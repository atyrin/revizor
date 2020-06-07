import {AzRestClient} from "../AzRestClient";
import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {PublicIpProperties} from "./AzPublicIpClient";
import {NetworkInterfaceProperties} from "./AzNetworkInterfaceClient";
import {NetworkSecurityGroupProperties} from "./AzNetworkSecurityGroupClient";

export interface AzItem {
    name: string;
    id: string;
    location: string;
    type: string;
    properties: PublicIpProperties | NetworkInterfaceProperties | NetworkSecurityGroupProperties;
}


export abstract class AzCommonClient {
    private readonly apiVersion: string
    private restClient: AzRestClient;
    protected readonly subscriptionId: string;

    protected constructor(azureCredentials: ServiceClientCredentials, subscriptionId: string, apiVersion: string) {
        this.restClient = new AzRestClient(azureCredentials);
        this.subscriptionId = subscriptionId;
        this.apiVersion = apiVersion;
    }

    async deleteMethod(resourceGroupName, resourceName): Promise<Response> {
        return await this.restClient.delete(this.createResourcePath(resourceGroupName, resourceName), this.apiVersion)
    }

    async get(resourceGroupName, resourceName): Promise<AzItem> {
        return await this.restClient.get(this.createResourcePath(resourceGroupName, resourceName), this.apiVersion)
    }

    async list(resourceGroupName): Promise<AzItem[]> {
        return await this.restClient.get(this.createResourcePath(resourceGroupName, null), this.apiVersion)
    }

    async listAll(): Promise<AzItem[]> {
        return await this.restClient.get(this.createResourcePath(null, null), this.apiVersion)
    }

    abstract createResourcePath(resourceGroupName: string, publicIpAddressName: string): string;
}