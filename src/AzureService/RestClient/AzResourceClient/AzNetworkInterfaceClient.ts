import {AzCommonClient} from "./AzCommonClient";
import {ServiceClientCredentials} from "@azure/ms-rest-js";

const API_VERSION = "2020-04-01"

export interface NetworkInterfaceProperties {
    macAddress: string;
    provisioningState: string;
    virtualMachine: ObjectLink;
    networkSecurityGroup: ObjectLink;
}

export interface ObjectLink {
    id: string;
}

/**
 * https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces
 */
export class AzNetworkInterfaceClient extends AzCommonClient{

    constructor(azureCredentials: ServiceClientCredentials, subscriptionId: string) {
        super(azureCredentials, subscriptionId, API_VERSION)
    }

    createResourcePath(resourceGroupName: string, networkInterfaceName: string): string{
        if(resourceGroupName && networkInterfaceName)
            return `subscriptions/${this.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkInterfaces/${networkInterfaceName}`
        if(resourceGroupName)
            return `subscriptions/${this.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkInterfaces`
        return `subscriptions/${this.subscriptionId}/providers/Microsoft.Network/networkInterfaces`
    }
}


/*

{
  {
  "name": "test-nic",
  "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/test-nic",
  "location": "eastus",
  "properties": {
    "provisioningState": "Succeeded",
    "ipConfigurations": [
      {
        "name": "ipconfig1",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/test-nic/ipConfigurations/ipconfig1",
        "properties": {
          "provisioningState": "Succeeded",
          "privateIPAddress": "172.20.2.4",
          "privateIPAllocationMethod": "Dynamic",
          "publicIPAddress": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/test-ip"
          },
          "subnet": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/rg1-vnet/subnets/default"
          },
          "primary": true,
          "privateIPAddressVersion": "IPv4"
        }
      }
    ],
    "dnsSettings": {
      "dnsServers": [],
      "appliedDnsServers": [],
      "internalDomainNameSuffix": "test.bx.internal.cloudapp.net"
    },
    "macAddress": "00-0D-3A-1B-C7-21",
    "enableAcceleratedNetworking": true,
    "enableIPForwarding": false,
    "networkSecurityGroup": {
      "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/nsg"
    },
    "primary": true,
    "virtualMachine": {
      "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Compute/virtualMachines/vm1"
    }
  },
  "type": "Microsoft.Network/networkInterfaces"
}

 */