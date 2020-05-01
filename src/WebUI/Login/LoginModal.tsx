import * as React from 'react';
import {DefaultButton, IconButton, IIconProps, Modal,} from 'office-ui-fabric-react';
import {TextField} from "office-ui-fabric-react/lib/TextField";

const cancelIcon: IIconProps = {iconName: 'Cancel'};

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
            dragOptions={undefined}
        >
            <div>
                <span>Login</span>
                <IconButton
                    iconProps={cancelIcon}
                    styles={iconButtonStyles}
                    ariaLabel="Close login form"
                    onClick={() => props.closeModal()}
                />
            </div>
            <div style={{padding: '0 24px 24px 24px'}}>

                <div>
                    <p>
                        Input application id from you Azure Active Directory. And optionally Directory Id if you app
                        configured only for usage in single directory.
                    </p>
                </div>
                <TextField label="Application ID"
                           onChange={((event, newValue) => props.updateClientId(newValue))}
                           value={props.clientId}/>
                <TextField label="Directory ID"
                           onChange={((event, newValue) => props.updateTenantId(newValue))}
                           value={props.tenantId}/>
                <DefaultButton onClick={() => props.triggerAuth()}>
                    AUTH
                </DefaultButton>
            </div>
        </Modal>
    );
};

const iconButtonStyles = {
    root: {
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    }
};