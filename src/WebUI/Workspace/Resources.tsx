import React, {useState} from 'react';

import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {Subscription} from "@azure/arm-subscriptions/esm/models";
import ResourceGraph from "../../AzureService/ResourceGraph/ResourceGraph";
import {ComboBox} from "office-ui-fabric-react";
import {Report, REPORTS} from "./Reports";
import AzCommonAboundedResource from "./ResourceTables/AzCommonAboundedResource";


interface Props {
    credentials: ServiceClientCredentials
    currentSubscription: Subscription
}


export const Resources: React.FunctionComponent<Props> = (props: Props) => {
    const [currentReport, setCurrentReport] = useState(REPORTS[0]);

    if (props.currentSubscription) {
        const resourceGraphClient = new ResourceGraph(props.credentials, [props.currentSubscription.subscriptionId])

        return (
            <div>
                <SelectReport selectedReport={currentReport}
                              setSelectedReport={(report) => setCurrentReport(report)}/>
                {getComponent(currentReport, resourceGraphClient)}
            </div>
        )
    }
    return (
        <div style={{padding: 10}}>
            Please, select a subscription for resources view
        </div>
    )

};

const getComponent = (report: Report, resourceGraphClient: ResourceGraph) => {
    switch (report.key) {
        case "AboundedNetworkInterface":
        case "UnassociatedNetworkSecurityGroups":
        case "EmptyResourceGroups":
        case "AboundedPublicIP":
        case "AboundedPublicIPWithNetworkInterface":
        case "AboundedManagedDisks":
            return (<AzCommonAboundedResource graphClient={resourceGraphClient}
                                              report={report}/>)
        default:
            return (<div>TODO: selected report in development</div>)
    }
}


interface SelectReportProps {
    selectedReport: Report;
    setSelectedReport: (r: Report) => void;
}

const SelectReport: React.FunctionComponent<SelectReportProps> = (props: SelectReportProps) => {

    const comboboxValues = REPORTS.map((report: Report) => {
        return ({key: report.key, text: report.displayName})
    })

    return (
        <ComboBox
            selectedKey={props.selectedReport ? props.selectedReport.key : undefined}
            style={{width: 300, padding: 10}}
            label="Reports"
            allowFreeform
            autoComplete="on"
            options={comboboxValues}
            onChange={(ev, option): void => {
                props.setSelectedReport(REPORTS.filter(s => s.key === option?.key)[0]);
            }}
        />
    )
};


