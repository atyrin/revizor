import {ComputeManagementClient, Disks, Snapshots, VirtualMachines} from "@azure/arm-compute";
import {NetworkInterfaces, NetworkManagementClient, NetworkSecurityGroups, PublicIPAddresses} from "@azure/arm-network";
import {ResourceGroups, ResourceManagementClient} from "@azure/arm-resources";
import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {AzResourceTypes} from "./AzResourceTypes";
import {AzContainerResource} from "./AzResource/AzContainerResource";
import {AzDiskResource} from "./AzResource/AzDiskResource";
import {AzCommonResource, IAzResource} from "./AzResource/AzResource";


export class AzureResourceFactory {
    public static create(type: AzResourceTypes, azureClient: ServiceClientCredentials, subscriptionId: string): IAzResource {
        const azureResourceClient = AzResourcesFactory.create(type, azureClient, subscriptionId);
        switch (type) {
            case AzResourceTypes.VirtualMachine:
            case AzResourceTypes.NetworkInterface:
            case AzResourceTypes.NetworkSecurityGroup:
            case AzResourceTypes.PublicIP:
                return new AzCommonResource(azureResourceClient as VirtualMachines | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups);
            case AzResourceTypes.ResourceGroup:
                return new AzContainerResource(azureResourceClient as ResourceGroups);
            case AzResourceTypes.ManagedDisk:
            case AzResourceTypes.ManagedSnapshot:
                return new AzDiskResource(azureResourceClient as Disks | Snapshots);
            default:
                throw new Error("Unknown Azure Resource")
        }
    }
}

class AzResourcesFactory {

    public static create(type: AzResourceTypes, azureClient: ServiceClientCredentials, subscriptionId: string): VirtualMachines | Disks | Snapshots | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups | ResourceGroups {
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
            case AzResourceTypes.ResourceGroup:
                return new ResourceManagementClient(azureClient, subscriptionId).resourceGroups;
            default:
                throw new Error(`Not implemented type: ${AzResourceTypes[type]}`)
        }
    }
}