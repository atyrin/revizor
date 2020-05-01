
import { ComputeManagementClient } from "@azure/arm-compute";

 

export default class ComputeManager{
    static createClient = (subscriptionId: string, creds: any):ComputeManagementClient => {
        return new ComputeManagementClient(creds, subscriptionId);
    }
}