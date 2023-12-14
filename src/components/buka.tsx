import React from 'react'
import useSWR from "swr";
import axios from "axios";
import Topbar from "@/components/template/main/topbar";
import Hero from "@/components/template/main/hero";
import Sekertariat from "@/components/template/main/sekertariat";
import Daftar from "@/components/template/main/daftar";
import Footer from "@/components/template/main/footer";

const cekstatus = async (url:string) => {
    try {
        const {data} = (await axios.get(url)).data
        if (data && data.length > 0){
            data.forEach((item:any) => {
                if (item.nama === "status_pendaftaran") {
                    if (item.value === 'tutup') {
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
const Buka = () => {
    const {data:buka} = useSWR('/api/setting/cek', cekstatus, {refreshInterval: 3000})
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