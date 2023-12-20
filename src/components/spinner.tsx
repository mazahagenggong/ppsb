import React from "react";

type SpinnerProps = {
    text: string,
    extended?: string,
};

const Spinner: React.FC<SpinnerProps> = ({ text, extended }) => {
    return (
        <React.Fragment>
            <center>
                <p className="text-center" style={{color: "black"}}>{text}</p>
                {extended && <span dangerouslySetInnerHTML={{ __html: extended }} />}
                <br/>
                <div className="spinner">
                    <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div></div>
                    <div></div>
                </div>
                <div>&nbsp;</div>
            </center>
        </React.Fragment>
    );
};

export default Spinner;