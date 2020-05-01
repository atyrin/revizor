import {ResourceGraphClient} from "@azure/arm-resourcegraph";
import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {QueryResponse} from "@azure/arm-resourcegraph/esm/models";

export default class ResourceGraph {
    private readonly client: ResourceGraphClient;
    private readonly subscriptions: string[];

    constructor(creds: ServiceClientCredentials, subscriptions: string[] = []) {
        this.client = new ResourceGraphClient(creds as any);
        this.subscriptions = subscriptions;
    }

    async query(queryString: string): Promise<QueryResponse> {
        return await this.client.resources({query: queryString, subscriptions: this.subscriptions})
    }
}

export interface ResourceGraphColumnType {
    name: string;
    type: string;
}

export interface ResourceGraphData {
    columns: Array<ResourceGraphColumnType>;
    rows: Array<Array<any>>;
}