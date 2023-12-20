import React, {ReactNode} from 'react';
import Link from "next/link";

interface ContentPros {
    children: ReactNode;
    title: string;
}
const PanelContent : React.FC<ContentPros> = ({children, title}) => {
    return (
        <>
            <div className="pagetitle">
                <h1>{title}</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href={"/panel"}>Home</Link></li>
                        <li className="breadcrumb-item active">{title}</li>
                    </ol>
                </nav>
            </div>
            {children}
        </>
    );
};

export default PanelContent;