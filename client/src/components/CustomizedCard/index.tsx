import { Paper, Typography } from "@mui/material";
import { ReactElement, ReactNode } from "react";
import "./styles.scss";

interface ICustomizedCard {
    title: string;
    children: ReactElement | ReactNode;
    actions?: ReactNode;
    className?: string;
}

const CustomizedCard = (props: ICustomizedCard) => {
    return (
        <Paper className={`customized-card ${props.className}`}>
            <div className="header">
                <Typography variant="h6" className="title">
                    {props.title}
                </Typography>
                <div className="action-btn-grp">{props.actions}</div>
            </div>
            {props.children}
        </Paper>
    );
};

export default CustomizedCard;
