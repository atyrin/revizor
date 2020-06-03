/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Disks, Snapshots, VirtualMachines} from "@azure/arm-compute";
import {NetworkInterfaces, NetworkSecurityGroups, PublicIPAddresses} from "@azure/arm-network";
import {Disk, VirtualMachine} from "@azure/arm-compute/esm/models";
import {NetworkInterface, PublicIPAddress} from "@azure/arm-network/esm/models";
import {AzResourcesClientFactory} from "../AzResourcesClientFactory";
import {AzContainerResource} from "./AzContainerResource";
import {ResourceGroups} from "@azure/arm-resources";
import {AzDiskResource} from "./AzDiskResource";
import {ServiceClientCredentials, HttpOperationResponse} from "@azure/ms-rest-js";
import {AzResourceTypes} from "../AzResourceTypes";


export interface IAzResource {
    delete(resourceGroupName: string, resourceName: string);

    get(resourceGroupName: string, resourceName: string);

    list();
}

export interface IAzEntityResource extends IAzResource {
    listByResourceGroup(resourceGroupName: string);
}

export class AzureResourceFactory {
    public static create(type: AzResourceTypes, azureClient: ServiceClientCredentials, subscriptionId: string): IAzResource {
        const azureResourceClient = AzResourcesClientFactory.create(type, azureClient, subscriptionId);
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

export class AzCommonResource implements IAzEntityResource {
    private resourceClient: VirtualMachines | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups;

    constructor(resourceClient: VirtualMachines | NetworkInterfaces | PublicIPAddresses | NetworkSecurityGroups) {
        this.resourceClient = resourceClient;
    }

    public delete = async (resourceGroupName: string, resourceName: string): Promise<HttpOperationResponse> => {
        const result = await this.resourceClient.deleteMethod(resourceGroupName, resourceName)
        return result._response
    }

    public get = async (resourceGroupName: string, resourceName: string): Promise<VirtualMachine | PublicIPAddress | NetworkInterface> => {
        return await this.resourceClient.get(resourceGroupName, resourceName);
    }

    public list = async (): Promise<VirtualMachine[] | Disk[] | PublicIPAddress[] | NetworkInterface[]> => {
        return await this.resourceClient.listAll();
    }

    public listByResourceGroup = async (resourceGroupName: string): Promise<VirtualMachine[] | Disk[] | PublicIPAddress[] | NetworkInterface[]> => {
        return await this.resourceClient.list(resourceGroupName);
    }
}