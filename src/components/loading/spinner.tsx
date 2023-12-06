import React from "react";
import style from "@/styles/loading.module.css";

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
                <div className={style.spinner}>
                    <div className={style.lds_roller}>
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