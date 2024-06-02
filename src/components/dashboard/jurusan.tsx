import React, {useEffect, useState} from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Jurusan = ({data}:any) => {
    const [dataj, setDataj] = useState<any>(null);
    useEffect(() => {
            const total = data.total;
            const belum = (total - data.pk) - data.umum;
            const persen = (jumlah: number) => {
                const persentase = Math.round((jumlah / total) * 100)
                return `${jumlah} (${persentase}%)`
            }
            const labels = [`PK: ${persen(data.pk)}`, `UMUM: ${persen(data.umum)}`, `Belum Mengisi Biodata: ${persen(belum)}`];
            setDataj({
                labels,
                datasets: [
                    {
                        label: 'Jumlah Santri',
                        data: [data.pk, data.umum, belum],
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
    }, [data]);
    return (
        <div className={"w-full md:w-1/2 my-3 md:mx-3"}>
            {dataj && (
                <Doughnut data={dataj}/>
            )}
        </div>
    );
};

export default Jurusan;