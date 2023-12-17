import React from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Image from "next/image";

const Sekertariat = () => {
    return (
        <>
            <section id="sekretariat">
                <div className="container" data-aos="fade-up" style={{marginTop: "-120px"}}>
                    <div className="breadcrumbs" data-aos="fade-in">
                        <div className="section-title">
                            <h2>Sekretariat</h2>
                        </div>
                        <div
                            className={"flex flex-col md:flex-row items-center justify-center"}>
                            <div
                                className={`w-full md:w-1/3 h-1/4 p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-3`}
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
                                <div className={"h-[25vh]"} style={{textDecoration: "none", textAlign: "center"}}>
                                    <p className="mt-3 text-2xl font-semibold text-black">AGUS SURAHMAN, S.Si</p>
                                    <p className="mb-2">Ketua PPSB</p>
                                    <p>No. Telp : 082236517179</p>
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
                                className={`w-full md:w-1/3 h-1/4 p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-3`}
                                style={{backgroundColor: "#fff"}}>
                                <div className={styles.photo_rounded}>
                                    <Image
                                        width="600"
                                        height="600"
                                        alt="Ustad Agus"
                                        src="https://res.cloudinary.com/dfko3mdsp/website/gs/egzotmlq7flcii86ij6t"
                                        priority
                                    />
                                </div>
                                <div className={"h-[25vh]"} style={{textDecoration: "none", textAlign: "center"}}>
                                    <p className="mt-3 text-2xl font-semibold text-black">MOHAMMAD JAMALUL LAIL, S.Pd</p>
                                    <p className="mb-2">Sekretaris</p>
                                    <p>No. Telp : 085733500155 / 082331103145</p>
                                    <p
                                        onClick={() => {
                                            window.open("https://t.me/iyLoeL", '_blank');
                                        }}
                                        style={{cursor: "pointer"}}>
                                        Telegram : @iyLoeL
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