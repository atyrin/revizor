import {ResourceGroups} from "@azure/arm-resources";
import {Disk, VirtualMachine} from "@azure/arm-compute/esm/models";
import {NetworkInterface, PublicIPAddress} from "@azure/arm-network/esm/models";
import {IAzResource} from "./AzResource";
import {ResourceGroup} from "@azure/arm-resources/esm/models";

export class AzContainerResource implements IAzResource {
    private resourceClient: ResourceGroups;

    constructor(resourceClient: ResourceGroups) {
        this.resourceClient = resourceClient;
    }

    public delete = async (resourceGroupName: string, resourceName: string): Promise<number> => {
        const result = await this.resourceClient.deleteMethod(resourceGroupName)
        return result._response.status
    }

    public get = async (resourceGroupName: string, resourceName: string): Promise<ResourceGroup> => {
        return await this.resourceClient.get(resourceGroupName, {expand: "instanceView"});
    }

    public list = async (): Promise<VirtualMachine[] | Disk[] | PublicIPAddress[] | NetworkInterface[]> => {
        return await this.resourceClient.list();
    }
}