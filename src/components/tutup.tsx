import React from 'react'
import useSWR from "swr";
import axios from "axios";

const cekstatus = async (url:string) => {
    const {data} = (await axios.get(url)).data
    if (data.status_pendaftaran === 'buka') {
        window.location.href = '/loading';
    }
    return data.status_pendaftaran
}
const Tutup = () => {
    const {data: status} = useSWR('/api/setting/cek', cekstatus,  { refreshInterval: 3000 })
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