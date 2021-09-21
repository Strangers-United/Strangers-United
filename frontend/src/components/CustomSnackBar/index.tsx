import { Snackbar } from "@material-ui/core";
import useMsg from "../../hooks/CustomMessageHook";
import Alert from "@material-ui/lab/Alert";

const CustomSnackBar = () => {
    const { msg, setMsg } = useMsg();
    return (
        <Snackbar
            open={msg?.show}
            autoHideDuration={3000}
            onClose={() => {
                setMsg({
                    show: false,
                    type: msg.type,
                    msg: "",
                });
            }}
        >
            <Alert elevation={6} variant="filled" severity={msg.type}>
                {msg.msg}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackBar;
