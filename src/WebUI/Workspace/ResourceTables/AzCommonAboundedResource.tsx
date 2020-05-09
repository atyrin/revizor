import * as React from "react";
import ResourceGraph, {ResourceGraphData} from "../../../AzureService/ResourceGraph/ResourceGraph";
import {Table} from "../../Components/Table";
import {Report} from "../Reports";
import {Text} from 'office-ui-fabric-react/lib/Text';
import {IAzResource} from "../../../AzureService/Compute/AzResource/AzResource";
import {OperationProgressPanel} from "../../Components/OperationProgressPanel";
import {Operation} from "../../Model/Operation";
import {TableColumn, TableItem} from "../../Model/TableItem";
import {sleep} from "../../Utils/Sleep";


interface Props {
    graphClient?: ResourceGraph;
    report: Report;
    resourceClient: IAzResource;
}

interface State {
    columns?: TableColumn[];
    items?: TableItem[];
    isPanelOpen: boolean;
    isPanelCloseLocked: boolean;
    operations: Operation[];
    triggerRerender: boolean;
}

const MAX_PARALLEL_DELETE_TASKS = 5


export default class AzCommonAboundedResource extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isPanelOpen: false,
            isPanelCloseLocked: false,
            operations: [],
            triggerRerender: false
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
            item => (new TableItem(this.props.resourceClient, {
                id: item[0],
                name: item[1],
                resourceGroup: item[2]
            }))
        )
        this.setState({columns: data.columns as TableColumn[], items: items})
    }

    private createRemoveOperation = (item: TableItem): Operation => {
        const operation: Operation = new Operation({
            operationType: `Remove ${this.props.report.displayName}`,
            itemName: item.name
        });
        operation.start();
        return operation;
    }

    private bulkItemsDeleteAction = async (items: TableItem[]) => {
        this.setState({isPanelOpen: true, isPanelCloseLocked: true})
        let activeTasksCount = 0;
        const tasksList = []
        const localItemsCopy = [...items]
        let processingItem = localItemsCopy.pop()

        while (true) {
            const localOperations = [] //group operation for correct render in case of fast state update with spread of current operations

            while (activeTasksCount < MAX_PARALLEL_DELETE_TASKS) {
                if (!processingItem) break;

                const operation: Operation = this.createRemoveOperation(processingItem);
                localOperations.push(operation)

                const deletePromise = processingItem.delete()
                    .then(() => {
                        operation.finishSuccess("Successfully Finished")
                        activeTasksCount--
                        this.setState({triggerRerender: !this.state.triggerRerender})
                    })
                    .catch((err) => {
                        operation.finishError(err)
                        activeTasksCount--
                        this.setState({triggerRerender: !this.state.triggerRerender})
                    })

                tasksList.push(deletePromise)
                activeTasksCount++
                processingItem = localItemsCopy.pop();
            }

            this.setState({operations: [...localOperations, ...this.state.operations]})
            if (!processingItem) break;
            await sleep(1000)
        }

        await Promise.all(tasksList)
        this.setState({isPanelCloseLocked: false})
        this.loadTableData()
    }


    private getContextActions = () => {
        return (
            [
                {
                    buttonName: "Delete",
                    action: (selection: TableItem[]) => {
                        this.bulkItemsDeleteAction(selection)
                    }
                },
                {
                    buttonName: "Details",
                    action: () => {
                        alert("TODO. Modal window with resource properties (tags, mb owner from activity log)")
                    }
                }
            ]
        )
    }

    render() {
        if (!this.state.columns) {
            return (
                <div>Nothing to show about {this.props.report.displayName}</div>
            )
        }
        return (
            <div style={{padding: 10}}>
                <Table columns={this.state.columns}
                       items={this.state.items}
                       contextActions={this.getContextActions()}
                />
                <OperationProgressPanel isOpen={this.state.isPanelOpen} isCloseLocked={this.state.isPanelCloseLocked}
                                        closePanel={() => this.setState({isPanelOpen: false})}
                                        operations={this.state.operations}/>
            </div>
        )
    }
}