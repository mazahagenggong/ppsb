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
        data: ip,
        error,
        isLoading
    } = useSWR('/api/spesifikdata/infopendaftaran', fetcher, {refreshInterval: 3000});

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        if (error) {
            setData(null)
        }
        if (isLoading) {
            setData(null)
        }
        if (ip) {
            const persen = (jumlah: number) => {
                const total = ip.data.total;
                const persentase = ((jumlah / total) * 100).toFixed(2)
                return `${jumlah} (${persentase}%)`
            }
            const labels = [`Medsos: ${persen(ip.data.medsos)}`, `Website: ${persen(ip.data.website)}`, `Brosur / Banner: ${persen(ip.data.bb)}`, `Keluarga / Teman: ${persen(ip.data.kt)}`, `Alumni: ${persen(ip.data.alumni)}`];
            setData({
                labels,
                datasets: [
                    {
                        label: 'Jumlah Pendaftar',
                        data: [ip.data.medsos, ip.data.website, ip.data.bb, ip.data.kt, ip.data.alumni],
                        backgroundColor: [
                            'rgba(2,136,234,0.5)',
                            'rgba(28,206,7,0.5)',
                            'rgba(2,33,234,0.5)',
                            'rgba(97,7,206,0.5)',
                            'rgba(234,2,188,0.5)',
                        ],
                        borderColor: [
                            'rgb(2,136,234)',
                            'rgb(28,206,7)',
                            'rgb(2,33,234)',
                            'rgb(97,7,206)',
                            'rgb(234,2,188)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [error, ip, isLoading]);
    return (
        <div className={"w-full md:w-1/2 my-3 md:mx-3"}>
            {data && (
                <Doughnut data={data}/>
            )}
        </div>
    );
};

export default Sekolah;