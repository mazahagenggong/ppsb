import React from 'react';
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";
import Gelombang from "@/components/buttons/gelombang";

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};
const GelombangPendaftaran = () => {
    const {data, isLoading, error, mutate} = useSWR('/api/setting/gelombang', fetcher);
    const handleMutate = () => {
        mutate();
    }
    console.log(data)
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
                                <span className="font-semibold">Terjadi Kesalahan saat mengambil data gelombang</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {data && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="flex flex-col w-11/12 m-3">
                                <div className="flex w-full justify-center">
                                    <h1 className="text-2xl font-semibold">Pengaturan Gelombang</h1>
                                </div>
                                <div className="flex flex-col w-full">
                                    {data && data.data?.length === 0 ? (
                                        <div className="flex flex-col w-full justify-center items-center">
                                            <span className="font-semibold">Belum ada gelombang pendaftaran</span>
                                        </div>
                                    ) : (
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <th>
                                                    Nama Gelombang
                                                </th>
                                                <th>
                                                    Tanggal
                                                </th>
                                                <th>
                                                </th>
                                            </tr>
                                            {data && data.data?.map((item: any, index: number) => (
                                                <tr key={index}>
                                                    <td>{item.nama}</td>
                                                    <td>{item.keterangan}</td>
                                                    {!item.active ? (
                                                        <td>
                                                        <span
                                                            className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 bg-[#CCCCCE]`}>
                                                            <span
                                                                className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200`}></span>
                                                        </span>
                                                        </td>
                                                    ) : (
                                                        <td>
                                                            <span
                                                                className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 bg-primary`}>
                                                            <span
                                                                className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 translate-x-6`}></span>
                                                        </span>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
                                    <div className="flex w-full justify-center">
                                        <Gelombang onMutate={handleMutate}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GelombangPendaftaran;