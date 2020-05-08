import * as React from "react";
import {MessageBar, Stack} from "office-ui-fabric-react";
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {Panel} from 'office-ui-fabric-react/lib/Panel';
import {Operation} from "../Model/Operation";


interface Props {
    isOpen: boolean;
    isCloseLocked: boolean;
    closePanel: () => void;
    operations: Operation[];
}

export const OperationProgressPanel: React.FunctionComponent<Props> = (props: Props) => {

    const items = props.operations.map((operation, index) => {
        return (
            <Stack.Item key={index}>
                <MessageBar
                    messageBarType={operation.result}
                >
                    <b>{`Operation: ${operation.operationType}`}</b>
                    <p>
                        {`Resource: ${operation.itemName}`}
                    </p>
                    <p>
                        {`State: ${operation.state}`}
                    </p>
                </MessageBar>
            </Stack.Item>
        )
    })

    return (
        <Panel
            isOpen={props.isOpen}
            hasCloseButton={false}
            headerText="Operations"
        >
            <p>Please take into account that full resource deletion will take some time on the Azure site.</p>
            <Stack style={{paddingBottom: 5}} tokens={{childrenGap: 2}}>
                {items}
            </Stack>
            <DefaultButton disabled={props.isCloseLocked} onClick={props.closePanel} text="Close"/>
        </Panel>)
};