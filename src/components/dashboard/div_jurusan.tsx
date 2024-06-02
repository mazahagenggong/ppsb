import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";
import RincianJurusan from "@/components/dashboard/rincian_jurusan";
import RincianJK from "@/components/dashboard/rincian_jk";
import Jurusan from "@/components/dashboard/jurusan";

const fetcher = async (url: string) => {
    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie("token") ?? "xxx"
        }
    });
    return res.data;
}
const DivJurusan = () => {
    const {
        data: jurusan,
        error,
        isLoading
    } = useSWR('/api/spesifikdata/jurusan', fetcher, {refreshInterval: 3000});

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        if (error) {
            setData(null)
        }
        if (isLoading) {
            setData(null)
        }
        if (jurusan) {
            const total = jurusan.data.total;
            const belum = (total - jurusan.data.pk) - jurusan.data.umum;
            const persen = (jumlah: number) => {
                const persentase = Math.round((jumlah / total) * 100)
                return `${jumlah} (${persentase}%)`
            }
            const labels = [`PK: ${persen(jurusan.data.pk)}`, `UMUM: ${persen(jurusan.data.umum)}`, `Belum Mengisi Biodata: ${persen(belum)}`];
            setData({
                labels,
                datasets: [
                    {
                        label: 'Jumlah Santri',
                        data: [jurusan.data.pk, jurusan.data.umum, belum],
                        backgroundColor: [
                            'rgba(252,231,0,0.2)',
                            'rgba(3,230,22,0.2)',
                            'rgba(214,6,61,0.2)',
                        ],
                        borderColor: [
                            'rgb(243,195,7)',
                            'rgb(10,197,4)',
                            'rgb(230,2,29)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [error, jurusan, isLoading]);
    return (
        <>
            {jurusan && (
                <div>
                    <hr className={"m-5"}/>
                    <p className={"text-2xl"}>Grafik Jurusan dan Jenis Kelamin:</p>
                    <div className={"flex flex-col md:flex-row"}>
                        <div className="flex flex-col w-full md:w-1/2 text-center items-center">
                            <RincianJurusan data={jurusan.data}/>
                            <RincianJK/>
                        </div>
                        <Jurusan data={jurusan.data}/>
                    </div>
                </div>
            )}
        </>
    );
};

export default DivJurusan;