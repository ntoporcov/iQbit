import roundLogo from "../images/logo_round.png";
import React from "react";

const LogoHeader = () => {
    return (
        <div className="LogoHeader">
            <img className="loginImage" alt="iQbit logo" src={roundLogo}/>
            <span className={"iqbit"}>iQbit</span>
            <span className={"poweredBy"}>Powered by qBitTorrent</span>
            <hr/>
        </div>
    )
}

export default LogoHeader;
