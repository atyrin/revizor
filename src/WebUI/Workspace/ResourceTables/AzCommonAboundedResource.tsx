import * as React from "react";
import ResourceGraph, {ResourceGraphData} from "../../../AzureService/ResourceGraph/ResourceGraph";
import {Table} from "../../Components/Table";
import {Report} from "../Reports";
import {Text} from 'office-ui-fabric-react/lib/Text';
import {IAzResource} from "../../../AzureService/Compute/AzResource/AzResource";
import {HttpOperationResponse} from "@azure/ms-rest-js";


interface Props {
    graphClient?: ResourceGraph;
    report: Report;
    resourceClient: IAzResource
}

interface State {
    columns?: any;
    items?: any;
}

interface TableItem {
    id: string;
    name: string;
    resourceGroup: string;
}


export default class AzCommonAboundedResource extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {}
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

    private deleteAction = async (items: TableItem[]) => {
        //todo
        if (items.length === 1) {
            const item = items[0];
            console.log(`Deleting item: ${item.resourceGroup} ${item.name}`)
            const response: HttpOperationResponse = await this.props.resourceClient.delete(item.resourceGroup, item.name)
            console.log(`Response code: ${response.status}`)
            if (response.status !== 202) {
                alert(`Failure during delete : ${response.bodyAsText}`)
                return;
            }
            this.loadTableData()
            return;
        }
        alert(`Are you sure want to delete all ${items.length} items?`)
        alert(`Ok, but currently this feature is unavailable`)
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
                               }
                           }
                       ]}
                />
            </div>
        )
    }
}