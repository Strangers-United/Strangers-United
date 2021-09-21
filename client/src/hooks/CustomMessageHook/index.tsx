import { useContext } from "react";
import { CustomMessageContext } from "../../providers/MessageProvider";

const useMsg = () => {
    const { msg, setMsg } = useContext(CustomMessageContext);
    return { msg, setMsg };
};
export default useMsg;
