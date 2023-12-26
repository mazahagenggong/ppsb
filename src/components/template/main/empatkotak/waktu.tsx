import React from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Link from "next/link";

const Waktu = () => {
    return (
        <div
            className={`${styles.gr2} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2 cursor-pointer`}
            style={{width: "100%", height: "30vh"}}>
            <Icon icon="ion:time-outline" width="64" height="64"/>
            <Link href="#" style={{textDecoration: "none"}}>
                <h1 className="mb-2 text-4xl font-semibold text-black">Waktu Pendaftaran</h1>
            </Link>
        </div>
    );
};

export default Waktu;