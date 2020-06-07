import {Disks, Snapshots} from "@azure/arm-compute";
import {Disk, Snapshot} from "@azure/arm-compute/esm/models";
import {IAzEntityResource} from "./AzResource";

export class AzDiskResource implements IAzEntityResource {
    private resourceClient: Disks | Snapshots;

    constructor(resourceClient: Disks | Snapshots) {
        this.resourceClient = resourceClient;
    }

    public delete = async (resourceGroupName: string, resourceName: string): Promise<number> => {
        const result = await this.resourceClient.deleteMethod(resourceGroupName, resourceName)
        return result._response.status
    }

    public get = async (resourceGroupName: string, resourceName: string): Promise<Snapshot | Disk> => {
        return await this.resourceClient.get(resourceGroupName, resourceName, {expand: "instanceView"});
    }

    public list = async (): Promise<Snapshot[] | Disk[]> => {
        return this.resourceClient.list()
    }

    public listByResourceGroup = async (resourceGroupName: string): Promise<Snapshot[] | Disk[]> => {
        return this.resourceClient.listByResourceGroup(resourceGroupName);
    }
}