import * as React from 'react';

import classnames from 'classnames';

import Card from '@material-ui/core/Card';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';
import { CContext } from './CountryDetails';
import { Gallery } from './Gallery';

const styles = (theme: Theme) => createStyles({
    card: {
        maxWidth: 1024,
        margin: 'auto',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    countryFlag: {
        verticalAlign: 'text-bottom',
        marginLeft: '10px',
        width: '50px',
        display: 'inline-block',
    },
    wikiText: {
        margin: '30px 20px auto auto',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    extractContent: {
        textAlign: 'justify',
    },
});

interface ICard {
    expanded: boolean,
    classes: any
}

class InfoCard extends React.Component<{}, ICard> {
    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false,
            classes: props
        }
    }

    public handleExpandClick = () => {
        this.setState(preState => ({ expanded: !preState.expanded }));
    };

    public render() {
        const { classes } = this.state.classes;

        return (
            <div>
                <CContext.Consumer>
                    {ctextData => {
                        const dataExtractCard = JSON.parse(ctextData.dataExtractCard);
                        const extractContent = ctextData.extractContent;
                        if (extractContent.length > 0) {

                            const extractBuf = extractContent.split('\n');
                            const extract = new Array();
                            let count = 0;
                            extractBuf.forEach((s, i) => {
                                // Filter out any empty element due to extra \n.
                                if (s.length > 0) {
                                    extract.push({ id: i, str: s });
                                }
                            });
                            return (
                                <Card className={classes.card}>
                                    <CardHeader
                                        avatar={
                                            <a href={dataExtractCard.flag} target="_blank">
                                                <img title={"Click to see the large version of this flag"} className={classes.countryFlag} src={dataExtractCard.flag} />
                                            </a>
                                        }
                                        action={
                                            <Typography className={classes.wikiText}>
                                                From Wikipedia
                                            </Typography>
                                        }
                                        title={dataExtractCard.name}
                                        subheader={"Country in " + dataExtractCard.region}
                                    />

                                    <CardContent>
                                        <CContext.Provider value={{dataExtractCard: "", extractContent: "", dataGallery: ctextData.dataGallery}}>
                                            <Gallery />
                                        </CContext.Provider>
                                        <Typography className={classes.extractContent} component="p">
                                            {extract[count++].str}
                                        </Typography>
                                    </CardContent>
                                    {extract.length > 1 ?
                                        <CardActions className={classes.actions} disableActionSpacing={true}>
                                            <IconButton aria-label="Share">
                                                <ShareIcon />
                                            </IconButton>
                                            <IconButton
                                                className={classnames(classes.expand, {
                                                    [classes.expandOpen]: this.state.expanded,
                                                })}
                                                onClick={this.handleExpandClick}
                                                aria-expanded={this.state.expanded}
                                                aria-label="Show more"
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </CardActions>
                                        : ''}
                                    {extract.length > 1 ?
                                        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
                                            <CardContent>
                                                <Typography className={classes.extractContent} paragraph={extract.length - 1 !== count}>
                                                    {extract[count++].str}
                                                </Typography>
                                                {extract.map((v: any, i: number) => {
                                                    // Not display the repeated contents
                                                    if (i >= count) {
                                                        return (
                                                            <Typography key={v.id} className={classes.extractContent} paragraph={extract.length - 1 !== i}>{v.str}</Typography>
                                                        );
                                                    } return
                                                })}
                                            </CardContent>
                                        </Collapse>
                                        : ''}
                                </Card>
                            );
                        } else {
                            return 'Content is empty.';
                        }
                    }}
                </CContext.Consumer>
            </div>
        );
    }
}

export const ExtractCard = withStyles(styles)(InfoCard);