import * as React from "react";
import ResourceGraph, {ResourceGraphData} from "../../../AzureService/ResourceGraph/ResourceGraph";
import {Table} from "../../Components/Table";
import {Report} from "../Reports";
import {Text} from 'office-ui-fabric-react/lib/Text';
import {IAzResource} from "../../../AzureService/Compute/AzResource/AzResource";
import {HttpOperationResponse} from "@azure/ms-rest-js";
import {Operation, OperationProgressPanel} from "../../Components/OperationProgressPanel";
import {MessageBarType} from "office-ui-fabric-react";

interface TableItem {
    id: string;
    name: string;
    resourceGroup: string;
}

interface Props {
    graphClient?: ResourceGraph;
    report: Report;
    resourceClient: IAzResource
}

interface State {
    columns?: any;
    items?: any;
    isPanelOpen: boolean;
    isPanelCloseLocked: boolean
    operations: Operation[]
}


export default class AzCommonAboundedResource extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isPanelOpen: false,
            isPanelCloseLocked: false,
            operations: []
        }
    }

    componentDidMount(): void {
        if (this.props.graphClient) this.loadTableData();
    }

    componentDidUpdate(prevProps: Props) {
        const isReportChanged = prevProps.report !== this.props.report
        const isGraphClientUpdated = prevProps.graphClient !== this.props.graphClient
        if ((isGraphClientUpdated || isReportChanged) && this.props.graphClient && this.props.report) {
            this.loadTableData()
        }
    }

    private loadTableData = async () => {
        const graphOutput = await this.props.graphClient.query(this.props.report.query);
        const data: ResourceGraphData = graphOutput.data;
        const items = data.rows.map(
            item => ({
                id: item[0],
                name: item[1],
                resourceGroup: item[2]
            })
        )
        this.setState({columns: data.columns, items: items})
    }

    private deleteResource = async (item: TableItem, operation: Operation) => {
        console.log(`Deleting item: ${item.resourceGroup} ${item.name}`)
        const response: HttpOperationResponse = await this.props.resourceClient.delete(item.resourceGroup, item.name)
        console.log(`Response code: ${response.status}`)
        if (response.status !== 204) {
            operation.result = MessageBarType.error
            operation.state = `Error: ${response.bodyAsText}`
            return ;
        }
        operation.state = "Successfully Finished"
        operation.result = MessageBarType.success
    }

    private deleteAction = async (items: TableItem[]) => {
        //todo: switch to bulk async remove for N item, rewrite state handling
        this.setState({isPanelOpen: true, isPanelCloseLocked: true})
        for (const item of items) {
            const operationsCopy = [...this.state.operations];
            let operation: Operation = {
                operationType: `Remove ${this.props.report.displayName}`,
                itemName: item.name,
                state: "Running",
                result: MessageBarType.info
            }
            this.setState({operations: [operation, ...this.state.operations]})
            await this.deleteResource(item, operation)
            this.setState({operations: [operation, ...operationsCopy]})
        }
        this.setState({isPanelCloseLocked: false})
        this.loadTableData()
        return;
    }

    render() {
        if (!this.state.columns) {
            return (
                <div>Nothing to show about {this.props.report.displayName}</div>
            )
        }
        return (
            <div style={{padding: 10}}>
                <Text>Showing report: {this.props.report.displayName}</Text>
                <Table columns={this.state.columns}
                       items={this.state.items}
                       contextActions={[
                           {
                               buttonName: "Delete",
                               action: (selection: TableItem[]) => {
                                   this.deleteAction(selection)
                               }
                           }, {
                               buttonName: "Details",
                               action: () => {
                                   alert("TODO. Modal window with resource properties (tags, mb owner from activity log)")
                               }
                           }
                       ]}
                />
                <OperationProgressPanel isOpen={this.state.isPanelOpen} isCloseLocked={this.state.isPanelCloseLocked}
                                        closePanel={() => this.setState({isPanelOpen: false})}
                                        operations={this.state.operations}/>
            </div>
        )
    }
}