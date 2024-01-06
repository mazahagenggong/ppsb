import React, {ReactNode, useState, useEffect} from 'react';
import Link from "next/link";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ContentPros {
    children: ReactNode;
    title: string;
}
const PanelContent : React.FC<ContentPros> = ({children, title}) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        if (isMounted) {
            toast('🚀 Halaman Selesai dimuat', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            setIsMounted(true);
        }
    },[isMounted])
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