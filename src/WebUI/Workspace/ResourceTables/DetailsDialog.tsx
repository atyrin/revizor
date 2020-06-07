import * as React from 'react';
import {useEffect, useState} from 'react';
import {Dialog} from 'office-ui-fabric-react/lib/Dialog';
import {TableItem} from "../../Model/TableItem";

interface Props {
    show: boolean;
    closeDialog: () => void;
    items: TableItem[];
}


export const DetailsDialog: React.FunctionComponent<Props> = (props: Props) => {
    const [details, setDetails] = useState<string>(null);

    useEffect(() => {
        if (props.items && props.items.length > 0) {
            props.items[0].details().then(details => setDetails(details))
        }
    }, [props.items])


    return (
        <Dialog
            hidden={!props.show}
            onDismiss={props.closeDialog}
            dialogContentProps={{
                title: "Details",
                subText: "TODO",
                showCloseButton: true,
                closeButtonAriaLabel: "Close"
            }}
        >
            {JSON.stringify(details)}
        </Dialog>
    )
};