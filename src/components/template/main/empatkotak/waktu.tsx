import React, {useState} from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Link from "next/link";
import Modal from "@/components/modal/small";

const Waktu = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Waktu Pendaftaran Offline</h3>
                <div className="flex flex-wrap justify-center m-3 items-center">
                    <table className="table-auto">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">Hari</th>
                            <th className="px-4 py-2">Jam</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className={`border px-4 py-2`}>Sabtu - Minggu</td>
                            <td className={`border px-4 py-2`}>07:30 - 12:00</td>
                        </tr>
                        <tr>
                            <td className={`border px-4 py-2`}>Senin - Kamis</td>
                            <td className={`border px-4 py-2`}>07:30 - 13:00</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Modal>
            <div
                className={`${styles.gr2} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2 cursor-pointer`}
                style={{width: "100%", height: "30vh"}} onClick={() => {
                setIsModalOpen(true);
            }}>
                <Icon icon="ion:time-outline" width="64" height="64"/>
                <Link href="#" style={{textDecoration: "none"}}>
                    <h1 className="mb-2 text-4xl font-semibold text-black">Waktu Pendaftaran</h1>
                </Link>
            </div>
        </>
    );
};

export default Waktu;