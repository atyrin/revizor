/* eslint-disable @typescript-eslint/interface-name-prefix */
import {VirtualMachines} from "@azure/arm-compute";
import {NetworkInterfaces, NetworkSecurityGroups, PublicIPAddresses} from "@azure/arm-network";
import {Disk, VirtualMachine} from "@azure/arm-compute/esm/models";
import {NetworkInterface, PublicIPAddress} from "@azure/arm-network/esm/models";
import {HttpOperationResponse} from "@azure/ms-rest-js";


export interface IAzResource {
    delete(resourceGroupName: string, resourceName: string);

    get(resourceGroupName: string, resourceName: string);

    list();
}

export interface IAzEntityResource extends IAzResource {
    listByResourceGroup(resourceGroupName: string);
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