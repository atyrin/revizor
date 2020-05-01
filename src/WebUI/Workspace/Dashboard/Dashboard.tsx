import * as React from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {Subscription} from "@azure/arm-subscriptions/esm/models";
import {IStackTokens, Stack} from "office-ui-fabric-react";
import ResourceGraph from "../../../AzureService/ResourceGraph/ResourceGraph";
import {REPORTS} from "../Reports";
import {DashboardCard} from "../../Components/DashboardCard";

interface Props {
    credentials: ServiceClientCredentials
    currentSubscription: Subscription
}

interface State {
    resourceGraphClient?: ResourceGraph
    counters: any
}


export default class Dashboard extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            counters: {}
        }
    }

    componentDidMount(): void {
        if (this.props.credentials && this.props.currentSubscription) {
            this.handleUpdateProps()
        }
    }

    componentDidUpdate(prevProps: Props) {
        const isCredentialsChanged = this.props.credentials !== prevProps.credentials
        const isCurrentSubscriptionChanged = this.props.currentSubscription !== prevProps.currentSubscription

        if ((isCredentialsChanged || isCurrentSubscriptionChanged) && this.props.credentials && this.props.currentSubscription) {
            this.handleUpdateProps()
        }
    }

    handleUpdateProps = () => {
        const graphClient = new ResourceGraph(this.props.credentials, [this.props.currentSubscription.subscriptionId]);
        this.setState({resourceGraphClient: graphClient})
        this.loadCounters(graphClient)
    }

    loadCounters = (resourceGraphClient) => {
        REPORTS.filter(report => report.query).forEach(async (report) => {
            const queryOutput = await resourceGraphClient.query(report.query);
            this.setState({counters: {...this.state.counters, [report.key]: queryOutput.count}})
        })
    }

    renderCards() {
        return REPORTS.filter(report => report.query).map((report) => {
            const count = this.state.counters[report.key]
            return <DashboardCard key={report.key} report={report} value={count}/>
        })
    }


    render() {
        if (this.props.currentSubscription) {
            return (
                <div style={{margin: '20px'}}>
                    <Stack wrap tokens={sectionStackTokens} horizontal>
                        {this.renderCards()}
                    </Stack>
                </div>
            )
        }
        return (
            <div style={{padding: 10}}>
                Please, select a subscription for dashboard view
            </div>
        )
    }
}

const sectionStackTokens: IStackTokens = {childrenGap: 20, padding: 10};
