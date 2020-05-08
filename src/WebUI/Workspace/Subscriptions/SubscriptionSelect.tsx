import * as React from "react";
import {useEffect, useState} from "react";
import {AzSubscriptions} from "../../../AzureService/Account/Subscriptions";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {ComboBox, DefaultButton, Stack} from 'office-ui-fabric-react';
import {Subscription, TenantIdDescription} from "@azure/arm-subscriptions/esm/models";

interface Props {
    azureClient: ServiceClientCredentials;
    currentSubscription: Subscription;
    setSubscription: (sub: Subscription) => void;
    directory: TenantIdDescription;
}


export const SubscriptionSelect: React.FunctionComponent<Props> = (props: Props) => {
    const [subscriptions, setSubscriptions] = useState(null);
    let subscriptionClient;
    if (props.azureClient) {
        subscriptionClient = new AzSubscriptions(props.azureClient);
    }

    useEffect(() => {
        console.log(`[SubscriptionSelect] Current azure client was changed. Recreate subscription client`)
        if (props.azureClient) {
            subscriptionClient = new AzSubscriptions(props.azureClient);
            setSubscriptions(null)
            props.setSubscription(null)
        }
    }, [props.azureClient])

    useEffect(() => {
        console.log(`[SubscriptionSelect] Current directory was changed. Clear subscription list`)
        setSubscriptions(null)
        props.setSubscription(null)
    }, [props.directory])


    if (!props.azureClient) {
        return (<div/>)
    }

    return (
        <div>
            <Stack horizontal={true} tokens={{padding: 10}}>
                <Stack.Item>
                    <Label style={{width: 180}}>Working subscription</Label>
                </Stack.Item>
                {subscriptions ?
                    <Stack.Item
                        disableShrink>{renderSubscriptionsCombobox(subscriptions, props.currentSubscription, props.setSubscription)}
                    </Stack.Item> :
                    <span/>
                }
                <Stack.Item>
                    <DefaultButton
                        onClick={() => loadSubscriptions(subscriptionClient, setSubscriptions, props.currentSubscription, props.setSubscription)}>
                        {subscriptions ? "Reload" : "Load subscriptions"}
                    </DefaultButton>
                </Stack.Item>
            </Stack>
        </div>
    )
};

//todo: move to single combobox with dirs
const renderSubscriptionsCombobox = (subscriptions: Subscription[], currentSubscription, setSubscription: (sub: Subscription) => void) => {

    if (!subscriptions) return <Label>{"No subscription loaded"}</Label>
    if (subscriptions.length === 0) return <Label>{"Empty subscriptions list"}</Label>

    const comboboxValues = subscriptions.map(sub => {
        return ({key: sub.id, text: sub.displayName})
    })

    return (
        <ComboBox
            selectedKey={currentSubscription ? currentSubscription.id : subscriptions[0].id}
            style={{width: 310}}
            autoComplete="on"
            options={comboboxValues}
            onChange={(ev, option): void => {
                const selectedSubscription = subscriptions.filter(s => s.id === option?.key)[0];
                if (!currentSubscription || selectedSubscription.id !== currentSubscription.id) setSubscription(selectedSubscription);
            }}
        />
    )
}

const loadSubscriptions = async (subscriptionClient: AzSubscriptions, setSubscriptions: (subs) => void, currentSub: Subscription, setSubscription: (sub) => void) => {
    const subscriptions = await subscriptionClient.list();
    if (!currentSub && subscriptions && subscriptions.length > 0) setSubscription(subscriptions[0])
    setSubscriptions(subscriptions)
}
