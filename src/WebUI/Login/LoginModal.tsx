import * as React from 'react';
import {Modal, PrimaryButton,} from 'office-ui-fabric-react';
import {TextField} from "office-ui-fabric-react/lib/TextField";
import {Text} from 'office-ui-fabric-react/lib/Text';

interface Props {
    isModalOpen: boolean
    closeModal: () => void

    tenantId: string;
    clientId: string;
    updateTenantId: (id: string) => void;
    updateClientId: (id: string) => void;
    triggerAuth: () => void
}

export const LoginModal: React.FunctionComponent<Props> = (props: Props) => {

    return (
        <Modal
            isOpen={props.isModalOpen}
            onDismiss={() => props.closeModal()}
            isBlocking={false}
            dragOptions={undefined} styles={modal}

        >
            <div style={title}>
                <Text variant={"mediumPlus"}>Authentication parameters</Text>
            </div>
            <div style={{padding: '0 24px 24px 24px'}}>
                <p>
                    Input Application ID from your Azure Active Directory. And optionally Directory ID if the app was
                    configured only for use in a single directory.
                </p>
                <TextField label="Application ID" required
                           onChange={((event, newValue) => props.updateClientId(newValue))}
                           value={props.clientId}/>
                <TextField label="Directory ID (optional)"
                           onChange={((event, newValue) => props.updateTenantId(newValue))}
                           value={props.tenantId}/>
                <div style={{display: 'flex'}}>
                    <PrimaryButton
                        style={{marginLeft: 'auto', marginTop: 10}}
                        onClick={() => props.triggerAuth()}>
                        Log in
                    </PrimaryButton>
                </div>

            </div>
        </Modal>
    );
};

const modal = {
    main: {
        maxWidth: 800
    }
}
const title = {
    margin: '20'
};