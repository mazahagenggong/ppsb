import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";
import {CloseSwal, LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";

const fetcher = async (url: string) => axios.get(url).then((res) => res.data);
const StatusPendaftaran = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const {data: cek, isLoading, error, mutate} = useSWR('/api/setting/cek', fetcher);

    const handleCheckboxChange = async () => {
        try {
            showWaitLoading("Mengubah status pendaftaran")
            await axios.post('/api/setting/ubah_status', {
                status_pendaftaran: isChecked ? "tutup" : "buka"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('token') || '',
                }
            });
            CloseSwal();
            mutate();
            setIsChecked(!isChecked);
        } catch (e) {
            console.log(e)
            LoadingTimer("Gagal mengubah status", "error", 1500);
        }
    }
    useEffect(() => {
        if (cek?.data) {
            const new_data = cek.data;
            new_data.forEach((item: any) => {
                if (item.nama === "status_pendaftaran") {
                    if (item.value === "buka") {
                        setIsChecked(true);
                    } else {
                        setIsChecked(false);
                    }
                }
            });
        }
    }, [cek?.data, isChecked]);
    return (
        <>
            {isLoading && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="flex justify-center items-center h-96">
                                <div
                                    className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="flex justify-center items-center h-96">
                                <span className="font-semibold">Terjadi Kesalahan saat mengambil data status</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {cek && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="flex flex-col md:flex-row w-11/12 m-3">
                                <div className="flex w-full md:w-1/2 justify-center md:justify-normal">
                                    <h1 className="text-2xl font-semibold">Pengaturan Pendaftaran</h1>
                                </div>
                                <div className="flex w-full md:w-1/2 justify-center md:justify-end">
                                    <label
                                        className='flex autoSaverSwitch relative inline-flex cursor-pointer select-none items-center flex-col md:flex-row'>
                                        <input
                                            type='checkbox'
                                            name='autoSaver'
                                            className='sr-only'
                                            checked={isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span
                                            className='label flex items-center text-sm font-medium text-black'>
                                            pendaftaran sedang di <span
                                            className='pl-1'> {isChecked ? 'buka' : 'tutup'}</span>&nbsp;
                                        </span>
                                        <span
                                            className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'}`}>
                                            <span
                                                className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''}`}></span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StatusPendaftaran;