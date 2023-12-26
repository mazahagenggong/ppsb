import React from 'react';
import {useTypewriter} from "react-simple-typewriter";
import styles from "@/styles/homepage/arab.module.css";
import Image from "next/image";
import {Icon} from '@iconify/react';
import Link from "next/link";
import Login from "@/components/buttons/login";

const Hero = () => {
    const [text] = useTypewriter({
        words: [
            "السلام عليكم ورحمة الله وبركاته"
        ],
        loop: 0,
        typeSpeed: 150,

    });
    return (
        <section className={`${styles.clients} ${styles.arab_bg}`}>
            <div className="container">
                <div className="row" data-aos="zoom-in">
                    <div className="col-lg-12 col-md-12 d-flex align-items-center justify-content-center">
                        <p className={styles.animated_arab} dir="rtl">
                            {text}
                        </p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row" data-aos="zoom-in">
                    <div>
                        <h1 className={`text-xl md:text-3xl p-3 m-auto text-white`}>
                            Selamat Datang di Sistem Pendaftaran Online Santri Baru
                            <br/>
                            MA Zainul Hasan 1 Genggong
                            <br/>
                            Tahun pelajaran 2023/2024
                        </h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="flex h-full flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2">
                        <center>
                            <Image
                                src={'/gambarpsb.png'}
                                alt={"gambar"}
                                className="mb-3"
                                width={800}
                                height={800}
                                priority
                            />

                            <div className="flex flex-wrap justify-center mb-6 items-center">
                                <div className="flex flex-col md:flex-row items-center">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2 md:mx-3"
                                    onClick={()=>{
                                        window.open("/assets/pdf/ppsb.pdf", '_blank');
                                    }}>
                                        Cara Daftar
                                    </button>
                                    <Link
                                        href="#daftar"
                                        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full my-2 md:mx-3"
                                        style={{textDecoration: "none"}}>
                                        Daftar Sekarang
                                    </Link>
                                    <Login/>
                                </div>
                            </div>
                        </center>
                    </div>
                    <div className="flex flex-col md:w-1/2">
                        <div className="flex flex-col w-full md:flex-row">
                            <div
                                className={`${styles.gr1} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2`}
                                style={{width: "100%", height: "30vh"}}>
                                <Icon icon="mingcute:wave-line" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 font-bold text-4xl text-black">Gelombang Pendaftaran</h1>
                                </Link>
                            </div>
                            <div
                                className={`${styles.gr2} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2`}
                                style={{width: "100%", height: "30vh"}}>
                                <Icon icon="ion:time-outline" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Waktu Pendaftaran</h1>
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:flex-row">
                            <div
                                className={`${styles.gr3} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2`}
                                style={{width: "100%", height: "30vh"}}>
                                <Icon icon="bx:video" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Video Profile</h1>
                                </Link>
                            </div>
                            <div
                                className={`${styles.gr4} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2`}
                                style={{width: "100%", height: "30vh"}}>
                                <Icon icon="gala:brochure" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Download Brosur</h1>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;