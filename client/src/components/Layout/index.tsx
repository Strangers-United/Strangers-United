import React, { ReactElement, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppSelector } from "../../store";
import Loading from "../Loading";
import NavBar from "../NavBar";
import "./style.scss";

type IMetamaskProvider = {
    children: ReactNode;
};

function Layout({ children }: IMetamaskProvider): ReactElement {
    const metamask = useAppSelector((state) => state.metamask);

    return (
        <div className="app">
            <NavBar />
            <div className="content">
                {metamask.ready && metamask.account ? children : <Loading />}
            </div>
        </div>
    );
}

export default Layout;
