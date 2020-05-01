export interface Report {
    key: string;
    displayName: string;
    query?: string
}

export const REPORTS: Array<Report> = [
    {
        key: "AboundedNetworkInterface",
        displayName: "Abounded Network Interfaces",
        query: "where type contains 'microsoft.network/networkinterfaces' and isempty(properties.virtualMachine) | project id, name, resourceGroup | sort by resourceGroup asc"
    },
    {
        key: "UnassociatedNetworkSecurityGroups",
        displayName: "Unassociated Network Security Groups",
        query: "where type =~ 'microsoft.network/networksecuritygroups' and isnull(properties.networkInterfaces) and isnull(properties.subnets) | project id, name, resourceGroup | sort by resourceGroup asc"
    },
    {
        key: "AboundedPublicIP",
        displayName: "Abounded Public IPs",
        query: "where type contains 'publicIPAddresses' and isempty(properties.ipConfiguration) | project id, name, resourceGroup | sort by resourceGroup asc"
    },
    {
        key: "AboundedPublicIPWithNetworkInterface",
        displayName: "Abounded Public IPs connected to Netowrk Interface",
        query: "Resources | where type =~ 'microsoft.network/publicipaddresses' | project publicIpId = id, id, name, resourceGroup | join ( Resources | where type =~ 'microsoft.network/networkinterfaces' and isempty(properties.virtualMachine) | mv-expand ipconfig=properties.ipConfigurations | project publicIpId = tostring(ipconfig.properties.publicIPAddress.id)) on publicIpId | project-away publicIpId , publicIpId1 | sort by resourceGroup asc"
    },
    {
        key: "EmptyResourceGroups",
        displayName: "Empty Resource Group",
        query: "ResourceContainers | where type =~ 'microsoft.resources/subscriptions/resourcegroups' | project id, name, resourceGroup | join kind=leftouter ( Resources | project resourceGroup ) on resourceGroup | where isempty(resourceGroup1) | sort by name asc"
    },
    {
        key: "AboundedManagedDisks",
        displayName: "Managed Disks not connected to VM",
        query: "where type =~ 'microsoft.compute/disks' and isempty(managedBy) | project id, name, resourceGroup | sort by resourceGroup asc"
    },
    {
        key: "AboundedAvailabilitySet",
        displayName: "Abounded Availability Set"
    },
    {
        key: "NonAttachedVHDsInStorageAccount",
        displayName: "Non Attached to any VM VHD disks in storage account"
    },
    {
        key: "AboundedManagedSnapshots",
        displayName: "Abounded Managed Snapshots"
    },
    {
        key: "ExpiredAdApplications",
        displayName: "Expired Active Directory Applications"
    }
]