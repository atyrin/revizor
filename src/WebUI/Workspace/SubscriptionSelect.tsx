import * as React from "react";
import {useState} from "react";
import {AzSubscriptions} from "../../AzureService/Account/Subscriptions";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {ComboBox, DefaultButton, Stack} from 'office-ui-fabric-react';
import {Subscription} from "@azure/arm-subscriptions/esm/models";

interface Props {
    credentials: ServiceClientCredentials
    currentSubscription: Subscription;
    setSubscription: (sub: Subscription) => void;
}


export const SubscriptionSelect: React.FunctionComponent<Props> = (props: Props) => {
    const [subscriptions, setSubscriptions] = useState(null);

    if (!props.credentials) {
        return (<div/>)
    }
    const subscriptionClient = new AzSubscriptions(props.credentials);
    //loadSubscriptions(subscriptionClient, setSubscriptions)


    return (
        <div>
            <Stack horizontal={true} tokens={{childrenGap: 20, padding: 10}}>
                <Stack.Item>
                    <DefaultButton
                        onClick={() => loadSubscriptions(subscriptionClient, setSubscriptions, props.setSubscription)}>
                        {subscriptions ? "Reload subscriptions" : "Load subscriptions"}
                    </DefaultButton>
                </Stack.Item>
                <Stack.Item disableShrink>
                    {subscriptions ? renderSubscriptionsCombobox(subscriptions, props.currentSubscription, props.setSubscription) :
                        <Label>{"Click show to load"}</Label>}
                </Stack.Item>
            </Stack>
        </div>

    )

};

const renderSubscriptionsCombobox = (subscriptions: Subscription[], currentSubscription, setSubscription: (sub: Subscription) => void) => {

    if (!subscriptions) return <Label>{"No subscription loaded"}</Label>
    if (subscriptions.length === 0) return <Label>{"Empty subscriptions list"}</Label>

    const comboboxValues = subscriptions.map(sub => {
        return ({key: sub.id, text: sub.displayName, raw: sub})
    })

    return (
        <ComboBox
            selectedKey={currentSubscription ? currentSubscription.id : undefined}
            style={{width: 300}}
            allowFreeform
            autoComplete="on"
            options={comboboxValues}
            onChange={(ev, option): void => {
                const selectedSubscription = subscriptions.filter(s => s.id === option?.key)[0];
                if (selectedSubscription.id !== currentSubscription.id) setSubscription(selectedSubscription);
            }}
        />
    )
}

const loadSubscriptions = async (subscriptionClient: AzSubscriptions, setSubscriptions: (subs: Subscription[]) => void, setSubscription: (sub: Subscription) => void) => {
    const subscriptions = await subscriptionClient.list();
    if (subscriptions && subscriptions.length > 0)
        setSubscription(subscriptions[0])
    setSubscriptions(subscriptions)
}
