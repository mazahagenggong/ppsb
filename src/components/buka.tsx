import React from 'react'
import useSWR from "swr";
import axios from "axios";

const cekstatus = async () => {
    const res = await axios.get('/api/cek')
    if (res.data.status === 'tutup') {
        window.location.href = '/loading';
    }
    return res.data.status
}
const Buka = () => {
    const {data: status} = useSWR('/api/cek', cekstatus,  { refreshInterval: 3000 })
    return (
        <>
            <center>
                <h2>SISTEM PENDAFTARAN SANTRI BARU</h2>
                <h2>MA ZAINUL HASAN GENGGONG</h2>
                <h1>SEDANG DIBUKA</h1>
                <h3>Informasi lebih lanjut hubungi bagian sekretariat pendaftaran</h3>
            </center>
        </>
    );
};

export default Buka;