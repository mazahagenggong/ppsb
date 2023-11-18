import React from 'react';
import {useTypewriter} from "react-simple-typewriter";
import styles from "@/styles/homepage/arab.module.css";
import Image from "next/image";
import {Icon} from '@iconify/react';
import Link from "next/link";

const Hero = () => {
    const [text] = useTypewriter({
        words: [
            "السلام عليكم ورحمة الله وبركاته"
        ],
        loop: 0,
        typeSpeed: 150,

    });
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const containerStyle = {
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', // dua kolom untuk tampilan desktop
        gap: isMobile ? '0' : '2px', // jarak antara dua kolom untuk tampilan desktop
    };
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
                        <h1 className={styles.selamat}>
                            Selamat Datang di Sistem Pendaftaran Online Santri Baru MA. Zainul Hasan 1 Genggong Tahun
                            pelajaran 2023/2024
                        </h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <div style={containerStyle}>
                    <div className="row">
                        <center>
                            <Image
                                src={'/gambarpsb.png'}
                                alt={"gambar"}
                                className="mb-3"
                                width={800}
                                height={800}
                                priority
                            />
                            {isMobile && (
                                <React.Fragment>
                                    <button
                                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded m-3">
                                        Cara Daftar
                                    </button>
                                    <Link
                                        href="#daftar"
                                        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded m-3"
                                        style={{textDecoration: "none"}}>
                                        Daftar Sekarang
                                    </Link>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3">
                                        Masuk
                                    </button>
                                </React.Fragment>
                            )}
                        </center>
                    </div>
                    <div>
                        <div className={isMobile ? "flex flex-col items-center" : "flex flex-row items-center"}>
                            <div
                                className={`${styles.gr1} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1`}
                                style={{width: "25em", height: "15em"}}>
                                <Icon icon="mingcute:wave-line" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Gelombang Pendaftaran</h1>
                                </Link>
                            </div>
                            <div
                                className={`${styles.gr2} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1`}
                                style={{width: "25em", height: "15em"}}>
                                <Icon icon="ion:time-outline" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Waktu Pendaftaran</h1>
                                </Link>
                            </div>
                        </div>
                        <div className={isMobile ? "flex flex-col" : "flex flex-row"}
                             style={{alignItems: "center", cursor: "pointer"}} onClick={() => {
                            window.open("https://www.youtube.com/watch?v=cWrqxdyQZgc", '_blank');
                        }}>
                            <div
                                className={`${styles.gr3} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1`}
                                style={{width: "25em", height: "15em"}}>
                                <Icon icon="bx:video" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Video Profile</h1>
                                </Link>
                            </div>
                            <div
                                className={`${styles.gr4} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1`}
                                style={{width: "25em", height: "15em"}}>
                                <Icon icon="gala:brochure" width="64" height="64"/>
                                <Link href="#" style={{textDecoration: "none"}}>
                                    <h1 className="mb-2 text-4xl font-semibold text-black">Download Brosur</h1>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {!isMobile && (
                    <div className="m-3">
                        <Link
                            href="#"
                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded m-3"
                            style={{textDecoration: "none"}}>
                            Cara Daftar
                        </Link>
                        <Link
                            href="#daftar"
                            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded m-3"
                            style={{textDecoration: "none"}}>
                            Daftar Sekarang
                        </Link>
                        <Link
                            href="#"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
                            style={{textDecoration: "none"}}>
                            Masuk
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;