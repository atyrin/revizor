import {IAzResource} from "../../AzureService/Compute/AzResource/AzResource";
import {HttpOperationResponse} from "@azure/ms-rest-js";

export interface TableColumn {
    name: string;
    type: string;
}


export class TableItem {
    private resourceClient: IAzResource;
    id: string;
    name: string;
    resourceGroup: string;

    constructor(resourceClient: IAzResource, init?: Partial<TableItem>) {
        this.resourceClient = resourceClient;
        Object.assign(this, init);
    }

    public delete = async () => {
        console.log(`Deleting item:[${this.name}] from [${this.resourceGroup}]`)
        try {
            const response: HttpOperationResponse = await this.resourceClient.delete(this.resourceGroup, this.name)
            console.log(`Item [${this.name}] was removed. Code: ${response.status}`)
        } catch (e) {
            console.log(`Failed to remove item[${this.name}]`)
            console.log(e)
            throw e as Error
        }
    }
}