import { CircularProgress } from "@mui/material";
import "./styles.scss";

interface ILoading {
    isAnimation?: boolean;
}

const Loading = ({ isAnimation }: ILoading) => {
    if (isAnimation) {
        return (
            <div className="loading">
                <CircularProgress style={{ color: "#FFF" }} disableShrink />
            </div>
        );
    }
    return <div className="loading">Loading...</div>;
};

export default Loading;
