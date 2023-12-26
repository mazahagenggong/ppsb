import React from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Link from "next/link";

const Video = () => {
    return (
        <div
            className={`${styles.gr3} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2 cursor-pointer`}
            style={{width: "100%", height: "30vh"}}
            onClick={() => {
                window.open("https://www.youtube.com/watch?v=cWrqxdyQZgc", '_blank');
            }}>
            <Icon icon="bx:video" width="64" height="64"/>
            <Link href="" style={{textDecoration: "none"}}>
                <h1 className="mb-2 text-4xl font-semibold text-black">Video Profile</h1>
            </Link>
        </div>
    );
};

export default Video;