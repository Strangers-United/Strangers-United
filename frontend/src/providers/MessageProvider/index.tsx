import React, { useEffect } from "react";
import { ReactElement } from "react";
import { createContext, useState } from "react";

type ICustomMessageProvider = {
    children: ReactElement;
};

interface Msg {
    show: boolean;
    type: "error" | "info" | "success" | "warning";
    msg: string;
}

const defaultMsg = {
    show: false,
    type: "success",
    msg: "",
} as Msg;

export const CustomMessageContext = createContext({
    msg: defaultMsg as Msg,
    setMsg: (_: Msg) => {},
});

export const CustomMessageProvider = ({
    children,
}: ICustomMessageProvider): ReactElement => {
    const [msgState, setMsgState] = useState(defaultMsg);

    const contextValue = {
        msg: msgState,
        setMsg: (val: Msg) => setMsgState(val),
    };
    return (
        <CustomMessageContext.Provider value={contextValue}>
            {children}
        </CustomMessageContext.Provider>
    );
};
