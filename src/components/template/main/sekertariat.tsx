import React from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Image from "next/image";

const Sekertariat = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return (
        <>
            <section id="sekretariat">
                <div className="container" data-aos="fade-up" style={{marginTop: "-120px"}}>
                    <div className="breadcrumbs" data-aos="fade-in">
                        <div className="section-title">
                            <h2>Sekretariat</h2>
                        </div>
                        <div
                            className={(isMobile ? "flex flex-col" : "flex flex-row") + " items-center justify-center"}>
                            <div
                                className={`max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-3`}
                                style={{backgroundColor: "#fff"}}>
                                <div className={styles.photo_rounded}>
                                    <Image
                                        width="600"
                                        height="600"
                                        alt="Ustad Agus"
                                        src="https://res.cloudinary.com/dfko3mdsp/website/gs/pnv2nqq0p0dcpocaa2bu"
                                        priority
                                    />
                                </div>
                                <div style={{textDecoration: "none", textAlign: "center"}}>
                                    <p className="mt-3 text-2xl font-semibold text-black">AGUS SURAHMAN, S.S</p>
                                    <p className="mb-2">Ketua PPSB</p>
                                    <p>No. Telp : 085731259039</p>
                                    <p
                                        onClick={() => {
                                            window.open("https://t.me/agus_surahman", '_blank');
                                        }}
                                        style={{cursor: "pointer"}}>
                                        Telegram : @agus_surahman
                                    </p>
                                </div>
                            </div>
                            <div
                                className={`max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-3`}
                                style={{backgroundColor: "#fff"}}>
                                <div className={styles.photo_rounded}>
                                    <Image
                                        width="600"
                                        height="600"
                                        alt="Ustad Agus"
                                        src="https://res.cloudinary.com/dfko3mdsp/website/gs/kme1tdhbc3lp3utpxzl8"
                                        priority
                                    />
                                </div>
                                <div style={{textDecoration: "none", textAlign: "center"}}>
                                    <p className="mt-3 text-2xl font-semibold text-black">NAJWAN NADA, S.Sos</p>
                                    <p className="mb-2">Sekretaris</p>
                                    <p>No. Telp : 082234510002</p>
                                    <p
                                        onClick={() => {
                                            window.open("https://t.me/najwannada", '_blank');
                                        }}
                                        style={{cursor: "pointer"}}>
                                        Telegram : @najwannada
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Sekertariat;