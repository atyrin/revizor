import {SubscriptionClient} from "@azure/arm-subscriptions";
import {Location, Subscription} from "@azure/arm-subscriptions/esm/models";
import {ServiceClientCredentials} from "@azure/ms-rest-js";


export class AzSubscriptions {
    private readonly client: SubscriptionClient;

    constructor(credentials: ServiceClientCredentials) {
        this.client = new SubscriptionClient(credentials);
    }

    list = async (): Promise<Array<Subscription>> => {
        return await this.client.subscriptions.list();
    }

    locations = async (subscriptionId: string): Promise<Array<Location>> => {
        return await this.client.subscriptions.listLocations(subscriptionId);
    }
}