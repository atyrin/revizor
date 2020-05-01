import * as React from "react";

import {ServiceClientCredentials} from "@azure/ms-rest-js";

import {Label} from 'office-ui-fabric-react/lib/Label';
import {ComboBox} from 'office-ui-fabric-react';
import {Location, Subscription} from "@azure/arm-subscriptions/esm/models";
import {AzSubscriptions} from "../../../AzureService/Account/Subscriptions";


interface Props {
    credentials: ServiceClientCredentials
    currentSubscription: Subscription
}

interface State {
    regions?: Location[];
}

//todo: switch to functional component
export default class AzRegions extends React.Component<Props, State> {
    private subscriptionClient: AzSubscriptions;

    constructor(props: Props) {
        super(props);
        this.state = {}

    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.credentials !== prevProps.credentials && this.props.credentials) {
            this.subscriptionClient = new AzSubscriptions(this.props.credentials);
        }
    }


    private loadRegions = async () => {
        const regions = await this.subscriptionClient.locations(this.props.currentSubscription.subscriptionId);
        console.log(regions);
        this.setState({regions: regions})
    }

    renderRegAsLabels = () => {
        if (!this.state.regions) return <Label>{"No subscription loaded"}</Label>
        if (this.state.regions.length === 0) return <Label>{"Empty subscriptions list"}</Label>
        const comboboxValues = this.state.regions.map(region => {
            return ({key: region.id, text: region.displayName})
        })

        return (
            <ComboBox
                defaultSelectedKey={comboboxValues ? comboboxValues[0].key : undefined}
                label="Regions"
                allowFreeform
                autoComplete="on"
                options={comboboxValues}
                onFocus={() => console.log('onFocus called for basic uncontrolled example')}
                onBlur={() => console.log('onBlur called for basic uncontrolled example')}
                onMenuOpen={() => console.log('ComboBox menu opened')}
                onPendingValueChanged={(option, pendingIndex, pendingValue) =>
                    console.log(`Preview value was changed. Pending index: ${pendingIndex}. Pending value: ${pendingValue}.`)
                }
            />
        )
    }


    render() {

        return (
            <div>
                {this.renderRegAsLabels()}
            </div>

        )
    }
}