import React, {useEffect, useState} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";

ChartJS.register(ArcElement, Tooltip, Legend);

const fetcher = async (url: string) => {
    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie("token") ?? "xxx"
        }
    });
    return res.data;
}
const Sekolah = () => {
    // const [data, setData] = useState<any>(null);
    const {
        data: sekolah,
        error,
        isLoading
    } = useSWR('/api/spesifikdata/sekolah', fetcher, {refreshInterval: 3000});

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        if (error) {
            setData(null)
        }
        if (isLoading) {
            setData(null)
        }
        if (sekolah) {
            const persen = (jumlah: number) => {
                const total = sekolah.data.mtszaha+sekolah.data.smpzaha+sekolah.data.lainnya;
                const persentase = Math.round((jumlah / total) * 100)
                return `${jumlah} (${persentase}%)`
            }
            const labels = [`MTs Zaha: ${persen(sekolah.data.mtszaha)}`, `SMP Zaha: ${persen(sekolah.data.smpzaha)}`, `Lainnya: ${persen(sekolah.data.lainnya)}`];
            setData({
                labels,
                datasets: [
                    {
                        label: 'Jumlah Pemdaftar',
                        data: [sekolah.data.mtszaha, sekolah.data.smpzaha, sekolah.data.lainnya],
                        backgroundColor: [
                            'rgba(0,252,39,0.2)',
                            'rgba(0,90,255,0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgb(2,236,68)',
                            'rgb(0,90,255)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [error, sekolah, isLoading]);
    return (
        <div className={"w-full md:w-1/2 my-3 md:mx-3"}>
            {data && (
                <Doughnut data={data}/>
            )}
        </div>
    );
};

export default Sekolah;