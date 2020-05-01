import * as React from 'react';
import {CommandBar, ICommandBarItemProps} from 'office-ui-fabric-react/lib/CommandBar';
import {AzureUser} from "./AzureUser";

interface Props {
    currentAccount?: AzureUser
    logout: () => void;
}

export const AppBar: React.FunctionComponent<Props> = (props: Props) => {
    return (
        <div>
            <CommandBar
                items={_items}
                farItems={_farItems(props)}
            />
        </div>
    );
};

const _items: ICommandBarItemProps[] = [

    {
        key: 'azure-revizor',
        text: 'Revizor for Microsoft Azure'
    }
];

const _farItems = (props: Props): ICommandBarItemProps[] => {
    if (!props.currentAccount) {
        return []
    }

    return (
        [
            {
                key: 'username',
                text: props.currentAccount.username,
                // This needs an ariaLabel since it's icon-only
                ariaLabel: 'Grid view',
                iconOnly: false
            },
            {
                key: 'logout',
                text: 'Logout',
                // This needs an ariaLabel since it's icon-only
                ariaLabel: 'Info',
                iconOnly: false,
                iconProps: {iconName: 'Info'},
                onClick: () => props.logout(),
            },
        ]
    )
}
