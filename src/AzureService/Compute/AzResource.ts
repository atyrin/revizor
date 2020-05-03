import {Disks, Snapshots, VirtualMachines} from "@azure/arm-compute";
import {NetworkInterfaces, NetworkSecurityGroups, PublicIPAddresses} from "@azure/arm-network";
import {Disk, VirtualMachine} from "@azure/arm-compute/esm/models";
import {NetworkInterface, PublicIPAddress} from "@azure/arm-network/esm/models";


export class AzResource implements AzResource {
    private resourceClient: VirtualMachines | Disks | Snapshots | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups;

    constructor(resourceClient: VirtualMachines | Disks | Snapshots | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups) {
        this.resourceClient = resourceClient;
    }

    public delete = async (resourceGroupName: string, resourceName: string): Promise<number> => {
        const result = await this.resourceClient.deleteMethod(resourceGroupName, resourceName)
        return result._response.status
    }

    public get = async (resourceGroupName: string, resourceName: string): Promise<VirtualMachine | PublicIPAddress | NetworkInterface> => {
        return await this.resourceClient.get(resourceGroupName, resourceName, {expand: "instanceView"});
    }

    public list = async (): Promise<VirtualMachine[] | Disk[] | PublicIPAddress[] | NetworkInterface[]> => {
        if (this.resourceClient instanceof Disks || this.resourceClient instanceof Snapshots) return this.resourceClient.list()
        return await this.resourceClient.listAll();
    }

    public listByResourceGroup = async (resourceGroupName): Promise<VirtualMachine[] | Disk[] | PublicIPAddress[] | NetworkInterface[]> => {
        if (this.resourceClient instanceof Disks || this.resourceClient instanceof Snapshots) return this.resourceClient.listByResourceGroup(resourceGroupName)
        return await this.resourceClient.list(resourceGroupName);
    }

}