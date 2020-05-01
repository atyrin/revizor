import {SubscriptionClient} from "@azure/arm-subscriptions";
import {Location, Subscription, TenantIdDescription} from "@azure/arm-subscriptions/esm/models";


export class AzSubscriptions {
    private readonly client: SubscriptionClient;

    constructor(credentials: any) {
        this.client = new SubscriptionClient(credentials);
    }

    list = async (): Promise<Array<Subscription>> => {
        return await this.client.subscriptions.list();
    }

    locations = async (subscriptionId: string): Promise<Array<Location>> => {
        return await this.client.subscriptions.listLocations(subscriptionId);
    }

    tenants = async (): Promise<Array<TenantIdDescription>> => {
        return await this.client.tenants.list();
    }
}