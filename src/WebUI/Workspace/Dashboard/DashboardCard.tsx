import * as React from "react";
import {Card, ICardSectionStyles, ICardSectionTokens, ICardTokens} from "@uifabric/react-cards";
import {IconButton} from "@fluentui/react/lib/Button";
import {Text} from "office-ui-fabric-react";
import {Report} from "../Reports";
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {Link} from "react-router-dom";

interface Props {
    report: Report;
    value?: number;
}

export const DashboardCard: React.FunctionComponent<Props> = (props: Props) => {
    if (props.value !== undefined) {
        return (
            <Link key={`link_${props.report.key}`} to={`/report/${props.report.key}`}
                  style={linkStyle}>
                <Card key={props.report.key} aria-label="Clickable horizontal card " tokens={cardTokens} onClick={()=>{}}>
                    <Card.Section horizontal>
                        <IconButton iconProps={{iconName: 'AzureLogo'}} title="AzureLogo" ariaLabel="AzureLogo"
                                    size={5}/>
                        <Text style={{padding: 2}} variant={"medium"}>
                            {props.report.displayName}
                        </Text>
                    </Card.Section>
                    <Card.Item grow={1}>
                        <span/>
                    </Card.Item>
                    <Card.Section styles={footerCardSectionStyles} tokens={footerCardSectionTokens}>
                        <Text variant={"xLarge"}>Count {props.value}</Text>
                    </Card.Section>
                </Card>
            </Link>)
    }
    return (
        <Card key={props.report.key} aria-label="Clickable horizontal card "
              horizontal tokens={cardTokens}>
            <Card.Section>
                <Spinner size={SpinnerSize.large} label="Loading..." ariaLive="assertive" labelPosition="right"/>
            </Card.Section>
        </Card>)
};

const cardTokens: ICardTokens = {childrenMargin: 12, width: 250, height: 150};

const footerCardSectionTokens: ICardSectionTokens = {padding: '12px 0px 0px'};
const footerCardSectionStyles: ICardSectionStyles = {
    root: {
        borderTop: '1px solid #F3F2F1',
    },
};

const linkStyle = {
    textDecoration: "none",
    color: "black"
}
