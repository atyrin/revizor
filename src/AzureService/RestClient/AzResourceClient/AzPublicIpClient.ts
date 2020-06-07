import {AzCommonClient} from "./AzCommonClient";
import {ServiceClientCredentials} from "@azure/ms-rest-js";

const API_VERSION = "2020-04-01"

export interface PublicIpProperties {
    provisioningState: string;
    publicIPAddressVersion: string;
    publicIPAllocationMethod: string;
    idleTimeoutInMinutes: number;
}

/**
 * https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses
 */
export class AzPublicIpClient extends AzCommonClient {

    constructor(azureCredentials: ServiceClientCredentials, subscriptionId: string) {
        super(azureCredentials, subscriptionId, API_VERSION)
    }

    createResourcePath(resourceGroupName: string, publicIpAddressName: string): string {
        if (resourceGroupName && publicIpAddressName)
            return `subscriptions/${this.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/${publicIpAddressName}`
        if (resourceGroupName)
            return `subscriptions/${this.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/publicIPAddresses`
        return `subscriptions/${this.subscriptionId}/providers/Microsoft.Network/publicIPAddresses`
    }
}


/*

{
  "name": "testDNS-ip",
  "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/testDNS-ip",
  "location": "westus",
  "properties": {
    "provisioningState": "Succeeded",
    "publicIPAddressVersion": "IPv4",
    "publicIPAllocationMethod": "Dynamic",
    "idleTimeoutInMinutes": 4,
    "ipConfiguration": {
      "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/testDNS649/ipConfigurations/ipconfig1"
    },
    "ipTags": [
      {
        "ipTagType": "FirstPartyUsage",
        "tag": "SQL"
      },
      {
        "ipTagType": "FirstPartyUsage",
        "tag": "Storage"
      }
    ]
  },
  "type": "Microsoft.Network/publicIPAddresses"
}


 */