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
const Gelombang = () => {
    const {
        data: gelombang,
        error,
        isLoading
    } = useSWR('/api/spesifikdata/gelombang', fetcher, {refreshInterval: 3000});
    const [data, setData] = useState<any>(null);
    const [countdata, setCountdata] = useState<any>(null);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Gelombang Pendaftaran',
            },
        },
    };

    useEffect(() => {
        if (error) {
            setData(null)
            setCountdata(null)
        }
        if (isLoading) {
            setData(null)
            setCountdata(null)
        }
        if (gelombang) {
            const labels = ['Gelombang 1', 'Gelombang 2', "Gelombang 3"];
            setData({
                labels,
                datasets: [
                    {
                        label: 'Bayar',
                        data: [gelombang.data.gel1NoPresCount, gelombang.data.gel2NoPresCount, gelombang.data.gel2NoPresCount],
                        backgroundColor: 'rgba(2,136,234,0.5)',
                    },
                    {
                        label: 'Prestasi',
                        data: [gelombang.data.gel1PresCount, gelombang.data.gel2PresCount, gelombang.data.gel2PresCount],
                        backgroundColor: 'rgba(28,206,7,0.5)',
                    },
                ],
            })
            setCountdata({
                "gel1byr": gelombang.data.gel1NoPresCount,
                "gel1pres": gelombang.data.gel1PresCount,
                "gel2byr": gelombang.data.gel2NoPresCount,
                "gel2pres": gelombang.data.gel2PresCount,
                "gel3byr": gelombang.data.gel3NoPresCount,
                "gel3pres": gelombang.data.gel3PresCount,
            })
        }
    }, [error, gelombang, isLoading]);

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
                                <th scope="col">Gelombang</th>
                                <th scope="col">Jenis</th>
                                <th scope="col">Jumlah</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Gelombang 1</td>
                                <td>Berbayar</td>
                                <td>{countdata.gel1byr} Pendaftar</td>
                            </tr>
                            <tr>
                                <td>Gelombang 1</td>
                                <td>Prestasi</td>
                                <td>{countdata.gel1pres} Pendaftar</td>
                            </tr>
                            <tr>
                                <td>Gelombang 2</td>
                                <td>Berbayar</td>
                                <td>{countdata.gel2byr} Pendaftar</td>
                            </tr>
                            <tr>
                                <td>Gelombang 2</td>
                                <td>Prestasi</td>
                                <td>{countdata.gel2pres} Pendaftar</td>
                            </tr>
                            <tr>
                                <td>Gelombang 3</td>
                                <td>Berbayar</td>
                                <td>{countdata.gel3byr} Pendaftar</td>
                            </tr>
                            <tr>
                                <td>Gelombang 3</td>
                                <td>Prestasi</td>
                                <td>{countdata.gel3pres} Pendaftar</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default Gelombang;