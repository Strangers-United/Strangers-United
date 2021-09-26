import { Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactElement, ReactNode } from "react";
import "./styles.scss";

interface ICustomizedCard {
    title: string;
    children: ReactElement | ReactNode;
    actions?: ReactNode;
}

const useStyles = makeStyles({
    paperRoot: {
        backgroundColor: "#253361",
        color: "#FFF",
        padding: "1em",
    },
    typoRoot: {
        color: "#9EB3C2",
        fontWeight: 700,
    },
});

const CustomizedCard = (props: ICustomizedCard) => {
    const classes = useStyles();

    return (
        <Paper className={`${classes.paperRoot} customized-card`}>
            <div className="header">
                <Typography variant="h6" className={classes.typoRoot}>
                    {props.title}
                </Typography>
                <div className="action-btn-grp">{props.actions}</div>
            </div>
            {props.children}
        </Paper>
    );
};

export default CustomizedCard;
