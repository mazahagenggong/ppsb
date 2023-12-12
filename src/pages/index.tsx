import Head from 'next/head'
import axios from "axios";
import useSWR, {mutate} from "swr";
import React from "react";
import Tutup from "@/components/tutup";
import Buka from "@/components/buka";

const cekstatus = async (url:string) => {
    const {data} = (await axios.get(url)).data;
    console.log("status ",data.status_pendaftaran)
    return data.status_pendaftaran
}
export default function Home() {
    const {data: status,isLoading, error} = useSWR('/api/setting/cek', cekstatus)
    console.log(status, isLoading, error)

    return (
        <React.Fragment>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {status === 'buka' ? (
                        <Buka/>
                    ) : (
                        <Tutup/>
                    )}
                </>
            )}

        </React.Fragment>
    )
}
