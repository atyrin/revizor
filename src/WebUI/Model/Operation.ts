import {MessageBarType} from "office-ui-fabric-react";

export class Operation {
    operationType: string;
    itemName: string;
    state: string;
    result: MessageBarType;

    constructor(init?: Partial<Operation>) {
        Object.assign(this, init);
    }

    public start = () => {
        this.result = MessageBarType.info;
        this.state = "Running";
    }

    public finishSuccess = (message: string) => {
        this.result = MessageBarType.success;
        this.state = message;
    }

    public finishError = (error: Error) => {
        this.result = MessageBarType.error;
        this.state = error.message;
    }
}