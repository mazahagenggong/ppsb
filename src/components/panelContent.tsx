import React, {ReactNode} from 'react';

interface ContentPros {
    children: ReactNode;
    title: string;
}
const PanelContent : React.FC<ContentPros> = ({children, title}) => {
    return (
        <>
            <div className="pagetitle">
                <h1>Dashboard</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/panel/dashboard'">Home</a></li>
                        <li className="breadcrumb-item active">{title}</li>
                    </ol>
                </nav>
            </div>
            {children}
        </>
    );
};

export default PanelContent;