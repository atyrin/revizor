import { ComputeManagementClient, ComputeManagementModels, ComputeManagementMappers } from "@azure/arm-compute";
import { VirtualMachine } from "@azure/arm-compute/esm/models";

 

export default class VmClient{
    private client: ComputeManagementClient;

    constructor(computeClient: ComputeManagementClient){
        this.client = computeClient;
    }

    getVms = async (): Promise<Array<VirtualMachine>> => {
        const vms: ComputeManagementModels.VirtualMachinesListAllResponse = await this.client.virtualMachines.listAll();
        return vms;
    }

    getVmsByresourceGroup = async (resourceGroupName): Promise<Array<VirtualMachine>> => {
        const vms: ComputeManagementModels.VirtualMachinesListAllResponse = await this.client.virtualMachines.list(resourceGroupName);
        return vms;
    }

    getVm = async (resourceGroupName: string, vmName: string): Promise<VirtualMachine> => {
        return await this.client.virtualMachines.get(resourceGroupName, vmName, { expand: "instanceView" });
    }

    doVm = async (vmId: string): Promise<VirtualMachine> => {
        return await this.client.virtualMachines.get("","")
    }

}