import React from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Link from "next/link";

const Sekertariat = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return (
        <>
            <div className="container" data-aos="fade-up" style={{marginTop: "-120px"}}>
                <div className="breadcrumbs" data-aos="fade-in">
                    <div className="section-title">
                        <h2>Sekertariat</h2>
                    </div>
                    <div className={isMobile ? "flex items-center" : "flex flex-col items-center"}>
                        <div className={`${styles.gr1} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-3`} style={{width: "25em", height: "15em"}} >
                            <Icon icon="mingcute:wave-line" width="64" height="64"/>
                            <Link href="#" style={{textDecoration: "none"}}>
                                <h1 className="mb-2 text-4xl font-semibold text-black">Gelombang Pendaftaran</h1>
                            </Link>
                        </div>
                        <div className={`${styles.gr2} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1`} style={{width: "25em", height: "15em"}} >
                            <Icon icon="ion:time-outline" width="64" height="64"/>
                            <Link href="#" style={{textDecoration: "none"}}>
                                <h1 className="mb-2 text-4xl font-semibold text-black">Waktu Pendaftaran</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sekertariat;