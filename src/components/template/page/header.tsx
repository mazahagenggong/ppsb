import React, {ReactNode} from 'react'
import Link from "next/link"
import Image from "next/image"

interface HeaderPros {
    children: ReactNode;
}

const THeader: React.FC<HeaderPros> = ({children}) => {
    return (
        <>
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    <Link
                        href={{
                            pathname: '/',
                        }}
                        className="logo d-flex align-items-center"
                        style={{textDecoration: "none"}}
                    >
                        <Image
                            src="/assets/img/logo.png"
                            alt="Logo Animasi"
                            className="img-fluid animated"
                            width={500}
                            height={300}
                            priority
                            style={{height: 'auto', width: 'auto'}}
                        />
                        <span className="d-none d-lg-block">Mumtaz</span>
                    </Link>
                    <i className="bi bi-list toggle-sidebar-btn"></i>
                </div>

                <div className="search-bar">
                </div>
                {children}
            </header>
        </>
    );
};

export default THeader;