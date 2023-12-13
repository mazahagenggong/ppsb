import React from 'react';
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";

const fetcher = async (url: string) => {
    const res = await axios.get(url);
    return res.data;
};
const GelombangPendaftaran = () => {
    const {data, isLoading, error, mutate} = useSWR('/api/setting/gelombang', fetcher);
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
                                        <tr>
                                            <td>Gelombang 1
                                            </td>
                                            <td>-&gt; 02 February 2023 <br/> &lt;- 02 March 2023</td>
                                            <td>
                                                <button className="btn btn-success">Aktifkan</button>

                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Gelombang 2
                                            </td>
                                            <td>-&gt; 03 March 2023 <br/> &lt;- 02 May 2023</td>
                                            <td>
                                                <button className="btn btn-success">Aktifkan</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Gelombang 3
                                            </td>
                                            <td>-&gt; 03 May 2023 <br/> &lt;- 26 June 2023</td>
                                            <td>
                                                Sedang Aktif
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                )}
                                <div className="flex w-full justify-center">
                                    <button
                                        className="btn btn-primary w-full md:w-auto md:ml-3 mt-3 md:mt-0 justify-center">Tambah
                                        Gelombang
                                    </button>
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