import * as React from 'react';
import {TextField} from 'office-ui-fabric-react/lib/TextField';
import {Toggle} from 'office-ui-fabric-react/lib/Toggle';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric';
import {PrimaryButton, Stack} from 'office-ui-fabric-react';
import {
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    Selection,
    SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import {MarqueeSelection} from 'office-ui-fabric-react/lib/MarqueeSelection';
import {mergeStyleSets} from 'office-ui-fabric-react/lib/Styling';

const classNames = mergeStyleSets({
    fileIconHeaderIcon: {
        padding: 0,
        fontSize: '16px',
    },
    fileIconCell: {
        textAlign: 'center',
        selectors: {
            '&:before': {
                content: '.',
                display: 'inline-block',
                verticalAlign: 'middle',
                height: '100%',
                width: '0px',
                visibility: 'hidden',
            },
        },
    },
    fileIconImg: {
        verticalAlign: 'middle',
        maxHeight: '16px',
        maxWidth: '16px',
    },
    controlWrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    exampleToggle: {
        display: 'inline-block',
        marginBottom: '10px',
        marginRight: '30px',
    },
    selectionDetails: {
        marginBottom: '20px',
    },
});
const controlStyles = {
    root: {
        margin: '0 30px 20px 0',
        maxWidth: '300px',
    },
};

export interface IDetailsListDocumentsExampleState {
    columns: IColumn[];
    items: any[];
    selectionDetails: string;
    isModalSelection: boolean;
    isCompactMode: boolean;
}

interface TableColumn {
    name: string;
    type: string;
}

interface Props {
    columns: Array<TableColumn>;
    items: Array<any>
    contextActions?: Array<ContextAction>
}

interface ContextAction {
    buttonName: string
    action: (selections: any[]) => void;
}

export class Table extends React.Component<Props, IDetailsListDocumentsExampleState> {
    private _selection: Selection;
    private _allItems: any;

    constructor(props: Props) {
        super(props);
        this.initTable(props)
    }

    private initTable = (props: Props) => {
        this._allItems = props.items;

        const columns: IColumn[] = props.columns.map(
            (column, index) => {
                return (
                    {
                        key: `column${index}`,
                        name: column.name,
                        fieldName: column.name,
                        minWidth: 70,
                        maxWidth: 290,
                        isResizable: true,
                        isCollapsible: true,
                        data: column.type,
                        onColumnClick: this._onColumnClick,
                        onRender: (item) => {
                            return <span>{item[column.name]}</span>;
                        },
                        isPadded: true,
                    })
            }
        );

        this._selection = new Selection({
            onSelectionChanged: () => {
                this.setState({
                    selectionDetails: this._getSelectionDetails(),
                });
            },
        });

        this.state = {
            items: this._allItems,
            columns: columns,
            selectionDetails: this._getSelectionDetails(),
            isModalSelection: true,
            isCompactMode: false
        };
    }

    renderContextActions() {
        if (!this.props.contextActions || this.props.contextActions.length === 0) return <div/>;
        const isDisabled = this._selection.getSelectedCount() === 0;
        return this.props.contextActions.map((contextAction: ContextAction) => {
            return (<PrimaryButton key={contextAction.buttonName} text={contextAction.buttonName}
                                   onClick={() => contextAction.action(this._selection.getSelection())}
                                   disabled={isDisabled} style={{marginRight: 5}}/>)
        })
    }


    public render() {
        const {columns, isCompactMode, items, selectionDetails, isModalSelection} = this.state;

        return (
            <Fabric>
                <div className={classNames.controlWrapper}>
                    <Toggle
                        label="Enable compact mode"
                        checked={isCompactMode}
                        onChange={this._onChangeCompactMode}
                        onText="Compact"
                        offText="Normal"
                        styles={controlStyles}
                    />
                    <Toggle
                        label="Enable modal selection"
                        checked={isModalSelection}
                        onChange={this._onChangeModalSelection}
                        onText="Modal"
                        offText="Normal"
                        styles={controlStyles}
                    />
                    <TextField label="Filter by name:" onChange={this._onChangeText} styles={controlStyles}/>
                </div>
                <Stack horizontal horizontalAlign="space-between">
                    <div className={classNames.selectionDetails}>{selectionDetails}</div>
                    <Stack horizontal>
                        {this.renderContextActions()}
                    </Stack>
                </Stack>
                {isModalSelection ? (
                    <MarqueeSelection selection={this._selection}>
                        <DetailsList
                            items={items}
                            compact={isCompactMode}
                            columns={columns}
                            selectionMode={SelectionMode.multiple}
                            getKey={this._getKey}
                            setKey="multiple"
                            layoutMode={DetailsListLayoutMode.justified}
                            isHeaderVisible={true}
                            selection={this._selection}
                            selectionPreservedOnEmptyClick={true}
                            onItemInvoked={this._onItemInvoked}
                            enterModalSelectionOnTouch={true}
                            ariaLabelForSelectionColumn="Toggle selection"
                            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                            checkButtonAriaLabel="Row checkbox"
                        />
                    </MarqueeSelection>
                ) : (
                    <DetailsList
                        items={items}
                        compact={isCompactMode}
                        columns={columns}
                        selectionMode={SelectionMode.none}
                        getKey={this._getKey}
                        setKey="none"
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        onItemInvoked={this._onItemInvoked}
                    />
                )}
            </Fabric>
        );
    }

    public componentDidUpdate(previousProps: Props, previousState: IDetailsListDocumentsExampleState) {
        if (previousProps.items !== this.props.items) {
            this.setState({items: this.props.items})
            this._allItems = this.props.items
        }
        if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
            this._selection.setAllSelected(false);
        }
    }

    private _getKey(item: any, index?: number): string {
        return item.key;
    }

    private _onChangeCompactMode = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
        this.setState({isCompactMode: checked});
    };

    private _onChangeModalSelection = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
        this.setState({isModalSelection: checked});
    };

    private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
        this.setState({
            items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1 || i.resourceGroup.toLowerCase().indexOf(text) > -1) : this._allItems,
        });
    };

    private _onItemInvoked(item: any): void {
        alert(`Item invoked: ${item.name}`);
    }

    private _getSelectionDetails(): string {
        const selectionCount = this._selection.getSelectedCount();

        switch (selectionCount) {
            case 0:
                return 'No items selected';
            case 1:
                return '1 item selected: ' + (this._selection.getSelection()[0] as any).name;
            default:
                return `${selectionCount} items selected`;
        }
    }

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const {columns, items} = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });
        const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            items: newItems,
        });
    };
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}
