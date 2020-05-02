import * as React from "react";
import {useEffect, useState} from "react";
import {AzSubscriptions} from "../../../AzureService/Account/Subscriptions";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {ComboBox, Stack} from 'office-ui-fabric-react';
import {TenantIdDescription} from "@azure/arm-subscriptions/esm/models";

interface Props {
    azureClient: ServiceClientCredentials
    currentDirectory: TenantIdDescription;
    setDirectory: (directory: TenantIdDescription) => void;
}


export const DirectorySelect: React.FunctionComponent<Props> = (props: Props) => {
    const [directories, setDirectories] = useState<TenantIdDescription[]>(null);

    useEffect(() => {
        if (props.azureClient) {
            const subscriptionClient = new AzSubscriptions(props.azureClient);
            loadDirs(subscriptionClient, setDirectories, props.currentDirectory, props.setDirectory)
        }
    }, [props.azureClient])


    return (
        <div>
            <Stack horizontal={true} tokens={{childrenGap: 20, padding: 10}}>
                <Stack.Item>
                    <Label>Working directory</Label>
                </Stack.Item>
                <Stack.Item disableShrink>
                    {directories ? renderDirectoriesCombobox(directories, props.currentDirectory, props.setDirectory) :
                        <Label>{"Directory placeholder"}</Label>}
                </Stack.Item>
            </Stack>
        </div>

    )
};

const renderDirectoriesCombobox = (directories: TenantIdDescription[], currentDirectory, setDirectory: (sub: TenantIdDescription) => void) => {

    if (!directories) return <Label>{"No directories loaded"}</Label>
    if (directories.length === 0) return <Label>{"Empty directories list"}</Label>

    const comboboxValues = directories.map(dir => {
        return ({key: dir.id, text: dir.tenantId})
    })

    return (
        <ComboBox
            selectedKey={currentDirectory ? currentDirectory.id : directories[0].id}
            style={{width: 300}}
            allowFreeform
            autoComplete="on"
            options={comboboxValues}
            onChange={(ev, option): void => {
                const selectedDirectory = directories.filter(s => s.id === option?.key)[0];
                if (!currentDirectory || selectedDirectory.id !== currentDirectory.id) setDirectory(selectedDirectory);
            }}
        />
    )
}

const loadDirs = async (subscriptionClient: AzSubscriptions, setDirectories: (dirs) => void, currentDir: TenantIdDescription, setDirectory: (dir) => void) => {
    const directories = await subscriptionClient.tenants();
    if (!currentDir && directories && directories.length > 0) setDirectory(directories[0])
    setDirectories(directories)
}
