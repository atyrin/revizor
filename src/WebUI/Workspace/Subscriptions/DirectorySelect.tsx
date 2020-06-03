import * as React from "react";
import {useEffect, useState} from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {ComboBox, Stack} from 'office-ui-fabric-react';
import {Spinner} from 'office-ui-fabric-react/lib/Spinner';
import {AzTenants, Tenant} from "../../../AzureService/Account/AzTenants";

interface Props {
    azureClient: ServiceClientCredentials;
    currentDirectory: Tenant;
    setDirectory: (directory: Tenant) => void;
}


export const DirectorySelect: React.FunctionComponent<Props> = (props: Props) => {
    const [directories, setDirectories] = useState<Tenant[]>(null);

    useEffect(() => {
        if (props.azureClient) {
            const tenantClient = new AzTenants(props.azureClient);
            tenantClient.list().then(tenants => console.log(tenants))

            loadDirs(tenantClient, setDirectories, props.currentDirectory, props.setDirectory)
        }
    }, [props.azureClient])


    return (
        <div>
            <Stack horizontal tokens={{padding: 10}}>
                <Stack.Item>
                    <Label style={{width: 180}}>Working directory</Label>
                </Stack.Item>
                <Stack.Item disableShrink>
                    {directories ? renderDirectoriesCombobox(directories, props.currentDirectory, props.setDirectory) :
                        <Spinner label="Loading directories..." ariaLive="assertive" labelPosition="left"/>}
                </Stack.Item>
            </Stack>
        </div>

    )
};

const renderDirectoriesCombobox = (directories: Tenant[], currentDirectory, setDirectory: (sub: Tenant) => void) => {

    if (!directories) return <Label>{"No directories loaded"}</Label>
    if (directories.length === 0) return <Label>{"Empty directories list"}</Label>

    const comboboxValues = directories.map(dir => {
        return ({key: dir.id, text: `${dir.displayName} (${dir.tenantId})`})
    })

    return (
        <ComboBox
            selectedKey={currentDirectory ? currentDirectory.id : directories[0].id}
            style={{width: 310}}
            autoComplete="on"
            options={comboboxValues}
            onChange={(ev, option): void => {
                const selectedDirectory = directories.filter(s => s.id === option?.key)[0];
                if (!currentDirectory || selectedDirectory.id !== currentDirectory.id) setDirectory(selectedDirectory);
            }}
        />
    )
}

const loadDirs = async (tenantClient: AzTenants, setDirectories: (dirs) => void, currentDir: Tenant, setDirectory: (dir) => void) => {
    const directories = await tenantClient.list();
    if (!currentDir && directories && directories.length > 0) setDirectory(directories[0])
    setDirectories(directories)
}
