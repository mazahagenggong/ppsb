import React, {useEffect, useState} from 'react';
import axios from "axios";
import {getCookie} from "cookies-next";
import useSWR from "swr";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const fetcher = async (url: string) => {
    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie("token") ?? "xxx"
        }
    });
    return res.data;
}
const InfoPendaftaran = () => {
    const {
        data: ip,
        error,
        isLoading
    } = useSWR('/api/spesifikdata/infopendaftaran', fetcher, {refreshInterval: 3000});
    const [data, setData] = useState<any>(null);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Info Pendaftaran',
            },
        },
    };

    useEffect(() => {
        if (error) {
            setData(null)
        }
        if (isLoading) {
            setData(null)
        }
        if (ip) {
            const labels = ['Informasi Pendaftaran'];
            setData({
                labels,
                datasets: [
                    {
                        label: 'Medsos',
                        data: [ip.data.medsos],
                        backgroundColor: 'rgba(2,136,234,0.5)',
                    },
                    {
                        label: 'Website',
                        data: [ip.data.website],
                        backgroundColor: 'rgba(28,206,7,0.5)',
                    },
                    {
                        label: 'Brosur / Banner',
                        data: [ip.data.bb],
                        backgroundColor: 'rgba(2,33,234,0.5)',
                    },
                    {
                        label: 'Keluarga / Teman',
                        data: [ip.data.kt],
                        backgroundColor: 'rgba(97,7,206,0.5)',
                    },
                    {
                        label: 'Alumni',
                        data: [ip.data.alumni],
                        backgroundColor: 'rgba(234,2,188,0.5)',
                    },
                ],
            })
        }
    }, [error, ip, isLoading]);

    return (
        <>
            {data && (
                <div className={"w-full md:w-1/2 my-3 md:mx-3"}>
                    <Bar options={options} data={data}/>
                    <p className={"m-3 text-2xl"}>Detail Data:</p>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped mb-3">
                            <thead>
                            <tr>
                                <th scope="col">Jenis</th>
                                <th scope="col">Jumlah</th>
                                <th scope="col">Persentase</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Medsos</td>
                                <td>{ip.data.medsos}</td>
                                <td>{((ip.data.medsos / ip.data.total) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>Website</td>
                                <td>{ip.data.website}</td>
                                <td>{((ip.data.website / ip.data.total) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>Brosur / Banner</td>
                                <td>{ip.data.bb}</td>
                                <td>{((ip.data.bb / ip.data.total) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>Keluarga / Teman</td>
                                <td>{ip.data.kt}</td>
                                <td>{((ip.data.kt / ip.data.total) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td>Alumni</td>
                                <td>{ip.data.alumni}</td>
                                <td>{((ip.data.alumni / ip.data.total) * 100).toFixed(2)}%</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default InfoPendaftaran;