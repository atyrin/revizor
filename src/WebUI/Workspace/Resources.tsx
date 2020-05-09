import React, {useEffect, useState} from 'react';

import {ServiceClientCredentials} from "@azure/ms-rest-js";
import {Subscription} from "@azure/arm-subscriptions/esm/models";
import ResourceGraph from "../../AzureService/ResourceGraph/ResourceGraph";
import {ComboBox, Stack} from "office-ui-fabric-react";
import {Report, REPORTS} from "./Reports";
import AzCommonAboundedResource from "./ResourceTables/AzCommonAboundedResource";
import {AzureResourceFactory, IAzResource} from "../../AzureService/Compute/AzResource/AzResource";

import {useParams} from "react-router-dom";
import {Label} from "office-ui-fabric-react/lib/Label";


interface Props {
    azureClient: ServiceClientCredentials;
    currentSubscription: Subscription;
}


export const Resources: React.FunctionComponent<Props> = (props: Props) => {
    const [currentReport, setCurrentReport] = useState<Report>(REPORTS[0]);

    const {reportkey} = useParams();
    console.log(`[Resources] Current url report param: ${reportkey}`)

    useEffect(() => {
        if (reportkey) {
            const parsedReport = parseUrlReport(reportkey);
            if (parsedReport) setCurrentReport(parsedReport);
        }
    }, [reportkey])


    const resourceGraphClient = new ResourceGraph(props.azureClient, [props.currentSubscription.subscriptionId])
    const resourceClient = getAzResourceClient(currentReport, props.azureClient, props.currentSubscription)

    return (
        <div>
            <SelectReport selectedReport={currentReport}
                          setSelectedReport={(report) => setCurrentReport(report)}/>
            {getComponent(currentReport, resourceGraphClient, resourceClient)}
        </div>
    )
};

const parseUrlReport = (urlReportKey: string): Report | void => {
    for (const report of REPORTS) {
        if (report.key === urlReportKey)
            return report;
    }
}

const getAzResourceClient = (report: Report, azureClient: ServiceClientCredentials, subscription: Subscription) => {
    return AzureResourceFactory.create(report.type, azureClient, subscription.subscriptionId)
}

const getComponent = (report: Report, resourceGraphClient: ResourceGraph, resourceClient: IAzResource) => {
    switch (report.key) {
        case "AboundedNetworkInterface":
        case "UnassociatedNetworkSecurityGroups":
        case "EmptyResourceGroups":
        case "AboundedPublicIP":
        case "AboundedPublicIPWithNetworkInterface":
        case "AboundedManagedDisks":
            return (<AzCommonAboundedResource graphClient={resourceGraphClient}
                                              report={report} resourceClient={resourceClient}/>)
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
        <Stack horizontal tokens={{padding: 10}}>
            <Stack.Item>
                <Label style={{width: 80}}>Report</Label>
            </Stack.Item>
            <Stack.Item>
                <ComboBox
                    selectedKey={props.selectedReport ? props.selectedReport.key : undefined}
                    style={{width: 310}}
                    autoComplete="on"
                    options={comboboxValues}
                    onChange={(ev, option): void => {
                        props.setSelectedReport(REPORTS.filter(s => s.key === option?.key)[0]);
                    }}
                />
            </Stack.Item>
        </Stack>

    )
};


