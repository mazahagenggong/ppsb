import React, {useEffect, useState} from 'react';
import styles from "@/styles/homepage/arab.module.css";
import {Icon} from "@iconify/react";
import Link from "next/link";
import Modal from "@/components/modal/small";
import useSWR from "swr";
import axios from "axios";

const Gelombang = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const {data, isLoading, error} = useSWR("/api/setting/gelombang", async (url) => {
        const cek = await axios.get(url);
        return cek.data.data;
    });
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);
    return (
        <>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 className={"text-center mb-3"}>Gelombang pendaftaran</h3>
                <div className="flex flex-wrap justify-center m-3 items-center">
                    {data && (
                        <table className="table-auto">
                            <thead>
                            <tr>
                                <th className="px-4 py-2">Gelombang</th>
                                <th className="px-4 py-2">Tanggal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className={`border px-4 py-2 ${item.active ? "bg-emerald-700" : ""}`}>{item.nama}</td>
                                    <td className={`border px-4 py-2 ${item.active ? "bg-emerald-700" : ""}`}>{item.keterangan}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Modal>
            <div
                className={`${styles.gr1} max-w-sm p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center m-1 md:w-1/2 cursor-pointer`}
                style={{width: "100%", height: "30vh"}}
                onClick={() => {
                    setIsModalOpen(true);
                }}>
                <Icon icon="mingcute:wave-line" width="64" height="64"/>
                <Link href="#" style={{textDecoration: "none"}}>
                    <h1 className="mb-2 font-bold text-4xl text-black">Gelombang Pendaftaran</h1>
                </Link>
            </div>
        </>
    );
};

export default Gelombang;