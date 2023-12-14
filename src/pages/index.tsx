import axios from "axios";
import useSWR, {mutate} from "swr";
import React, {useEffect, useState} from "react";
import Tutup from "@/components/tutup";
import Buka from "@/components/buka";

const cekstatus = async (url:string) => {
    const {data} = (await axios.get(url)).data;
    return data
}
export default function Home() {
    const {data,isLoading, error} = useSWR('/api/setting/cek', cekstatus);
    const [status, setStatus] = useState<string|null>(null);
    useEffect(() => {
        if (data && data.length > 0){
            data.forEach((item:any) => {
                if (item.nama === "status_pendaftaran") {
                    setStatus(item.value);
                }
            });
        }
    }, [data]);

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
