import React from "react";
import Template from "@/components/template/santri/template";
import useSWR from "swr";
import {getCookie} from "cookies-next";
import axios from "axios";
import Upload from "@/components/santri/pembayaran/upload";
import Menunggu from "@/components/santri/pembayaran/menunggu";

export default function Home() {

    const token = getCookie("token_santri");
    const fetcher = async (url: string) => {
        const data = await axios.post(url, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        return data.data;
    };
    const {data, error, isLoading} = useSWR("/api/auth/santri/detail", fetcher);
    // console.log(data);
    return (
        <Template>
            {isLoading && (
                <>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </>
            )}
            {error && (
                <>
                    <h1 className="text-2xl font-bold text-gray-700">Terhadi Kesalahan</h1>
                </>
            )}
            {data && (
                <div className="flex flex-col justify-center items-center">
                    {!data.data.pembayaran ? (
                        <Upload/>
                    ):(
                        <>
                        {data.data.pembayaran.status === 'menunggu' && (
                                <Menunggu bukti={data.data.pembayaran.bukti}/>
                            )}
                        </>
                    )}

                </div>
            )}
        </Template>
    )
}
