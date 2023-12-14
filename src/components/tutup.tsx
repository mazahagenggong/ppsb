import React from 'react'
import useSWR from "swr";
import axios from "axios";

const cekstatus = async (url:string) => {
    try {
        const {data} = (await axios.get(url)).data
        if (data && data.length > 0){
            data.forEach((item:any) => {
                if (item.nama === "status_pendaftaran") {
                    if (item.value === 'buka') {
                        window.location.href = '/loading';
                    }
                }
            });
        }
        return data
    }
    catch (e) {
        console.log(e)
    }
}
const Tutup = () => {
    const {data: status} = useSWR('/api/setting/cek', cekstatus, {refreshInterval: 3000} )
    return (
        <>
            <center>
                <h2>SISTEM PENDAFTARAN SANTRI BARU</h2>
                <h2>MA ZAINUL HASAN GENGGONG</h2>
                <h1>SEDANG DITUTUP</h1>
                <h3>Informasi lebih lanjut hubungi bagian sekretariat pendaftaran</h3>
            </center>
        </>
    );
};

export default Tutup;