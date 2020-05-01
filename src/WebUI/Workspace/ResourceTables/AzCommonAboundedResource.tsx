import * as React from "react";
import ResourceGraph, {ResourceGraphData} from "../../../AzureService/ResourceGraph/ResourceGraph";
import {Table} from "../../Components/Table";
import {Report} from "../Reports";
import {Text} from 'office-ui-fabric-react/lib/Text';


interface Props {
    graphClient?: ResourceGraph;
    report: Report;
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
        if (this.props.graphClient) this.loadDate();
    }

    componentDidUpdate(prevProps: Props) {
        const isReportChanged = prevProps.report !== this.props.report
        const isGraphClientUpdated = prevProps.graphClient !== this.props.graphClient
        if ((isGraphClientUpdated || isReportChanged) && this.props.graphClient && this.props.report) {
            this.loadDate()
        }
    }

    private loadDate = async () => {
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

    private deleteAction(items: TableItem[]) {
        //todo
        if (items.length === 1) {
            alert(`Delete ${items[0].id}`)
            return;
        }
        alert(`Delete all ${items.length} items`)
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