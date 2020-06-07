import {AzCommonClient} from "./AzCommonClient";
import {ServiceClientCredentials} from "@azure/ms-rest-js";

const API_VERSION = "2020-04-01"

export interface NetworkSecurityGroupProperties {
    provisioningState: string;
    securityRules: any[];
    defaultSecurityRules: any[];
}


/**
 * https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups
 */
export class AzNetworkSecurityGroupClient extends AzCommonClient{

    constructor(azureCredentials: ServiceClientCredentials, subscriptionId: string) {
        super(azureCredentials, subscriptionId, API_VERSION)
    }

    createResourcePath(resourceGroupName: string, networkSecurityGroupName: string): string{
        if(resourceGroupName && networkSecurityGroupName)
            return `subscriptions/${this.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/${networkSecurityGroupName}`
        if(resourceGroupName)
            return `subscriptions/${this.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups`
        return `subscriptions/${this.subscriptionId}/providers/Microsoft.Network/networkSecurityGroups`
    }
}


/*

{
  "name": "testnsg",
  "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg",
  "type": "Microsoft.Network/networkSecurityGroups",
  "location": "westus",
  "properties": {
    "provisioningState": "Succeeded",
    "securityRules": [
      {
        "name": "rule1",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/securityRules/rule1",
        "properties": {
          "provisioningState": "Succeeded",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "80",
          "sourceAddressPrefix": "*",
          "destinationAddressPrefix": "*",
          "access": "Allow",
          "priority": 130,
          "direction": "Inbound"
        }
      }
    ],
    "defaultSecurityRules": [
      {
        "name": "AllowVnetInBound",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/defaultSecurityRules/AllowVnetInBound",
        "properties": {
          "provisioningState": "Succeeded",
          "description": "Allow inbound traffic from all VMs in VNET",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "*",
          "sourceAddressPrefix": "VirtualNetwork",
          "destinationAddressPrefix": "VirtualNetwork",
          "access": "Allow",
          "priority": 65000,
          "direction": "Inbound"
        }
      },
      {
        "name": "AllowAzureLoadBalancerInBound",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/defaultSecurityRules/AllowAzureLoadBalancerInBound",
        "properties": {
          "provisioningState": "Succeeded",
          "description": "Allow inbound traffic from azure load balancer",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "*",
          "sourceAddressPrefix": "AzureLoadBalancer",
          "destinationAddressPrefix": "*",
          "access": "Allow",
          "priority": 65001,
          "direction": "Inbound"
        }
      },
      {
        "name": "DenyAllInBound",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/defaultSecurityRules/DenyAllInBound",
        "properties": {
          "provisioningState": "Succeeded",
          "description": "Deny all inbound traffic",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "*",
          "sourceAddressPrefix": "*",
          "destinationAddressPrefix": "*",
          "access": "Deny",
          "priority": 65500,
          "direction": "Inbound"
        }
      },
      {
        "name": "AllowVnetOutBound",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/defaultSecurityRules/AllowVnetOutBound",
        "properties": {
          "provisioningState": "Succeeded",
          "description": "Allow outbound traffic from all VMs to all VMs in VNET",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "*",
          "sourceAddressPrefix": "VirtualNetwork",
          "destinationAddressPrefix": "VirtualNetwork",
          "access": "Allow",
          "priority": 65000,
          "direction": "Outbound"
        }
      },
      {
        "name": "AllowInternetOutBound",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/defaultSecurityRules/AllowInternetOutBound",
        "properties": {
          "provisioningState": "Succeeded",
          "description": "Allow outbound traffic from all VMs to Internet",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "*",
          "sourceAddressPrefix": "*",
          "destinationAddressPrefix": "Internet",
          "access": "Allow",
          "priority": 65001,
          "direction": "Outbound"
        }
      },
      {
        "name": "DenyAllOutBound",
        "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/testnsg/defaultSecurityRules/DenyAllOutBound",
        "properties": {
          "provisioningState": "Succeeded",
          "description": "Deny all outbound traffic",
          "protocol": "*",
          "sourcePortRange": "*",
          "destinationPortRange": "*",
          "sourceAddressPrefix": "*",
          "destinationAddressPrefix": "*",
          "access": "Deny",
          "priority": 65500,
          "direction": "Outbound"
        }
      }
    ]
  }
}

 */