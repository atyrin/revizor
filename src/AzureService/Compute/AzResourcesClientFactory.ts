import {ComputeManagementClient, Disks, Snapshots, VirtualMachines} from "@azure/arm-compute";
import {NetworkInterfaces, NetworkManagementClient, NetworkSecurityGroups, PublicIPAddresses} from "@azure/arm-network";

class AzResourcesClientFactory {

    public static create(type: AzResourceTypes, azureClient, subscriptionId: string): VirtualMachines | Disks | Snapshots | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups {
        switch (type) {
            case AzResourceTypes.VirtualMachine:
                return new ComputeManagementClient(azureClient, subscriptionId).virtualMachines;
            case AzResourceTypes.ManagedDisk:
                return new ComputeManagementClient(azureClient, subscriptionId).disks;
            case AzResourceTypes.ManagedSnapshot:
                return new ComputeManagementClient(azureClient, subscriptionId).snapshots;
            case AzResourceTypes.NetworkInterface:
                return new NetworkManagementClient(azureClient, subscriptionId).networkInterfaces;
            case AzResourceTypes.PublicIP:
                return new NetworkManagementClient(azureClient, subscriptionId).publicIPAddresses;
            case AzResourceTypes.NetworkSecurityGroup:
                return new NetworkManagementClient(azureClient, subscriptionId).networkSecurityGroups;
            default:
                throw new Error(`Not implemented type: ${AzResourceTypes[type]}`)
        }
    }
}