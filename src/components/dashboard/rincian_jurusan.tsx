import React from 'react';

const Rjur = ({data}:any) => {
    const total = data.total;
    const belum = (total - data.pk) - data.umum;
    const persen = (jumlah: number) => {
        const persentase = Math.round((jumlah / total) * 100)
        return `${persentase}%`
    }

    return (
        <>
            {data && (
                <div className={"w-full md:w-1/2 my-3 md:mx-3"}>
                    <p className={"m-3 text-2xl"}>Detail Data Jurusan:</p>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped mb-3">
                            <thead>
                            <tr>
                                <th scope="col">Jurusan</th>
                                <th scope="col">Jumlah</th>
                                <th scope="col">Persentase</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>PK</td>
                                <td>{data.pk} Santri</td>
                                <td>{persen(data.pk)}</td>
                            </tr>
                            <tr>
                                <td>UMUM</td>
                                <td>{data.umum} Santri</td>
                                <td>{persen(data.umum)}</td>
                            </tr>
                            <tr>
                                <td>Belum Isi Biodata</td>
                                <td>{belum} Santri</td>
                                <td>{persen(belum)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default Rjur;