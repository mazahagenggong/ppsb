import React from 'react'
import useSWR from "swr";
import axios from "axios";
import Topbar from "@/components/template/main/topbar";
import Hero from "@/components/template/main/hero";
import Sekertariat from "@/components/template/main/sekertariat";
import Daftar from "@/components/template/main/daftar";
import Footer from "@/components/template/main/footer";

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
            <Topbar/>
            <Hero/>
            <Sekertariat/>
            <Daftar/>
            <Footer/>
        </>
    );
};

export default Buka;