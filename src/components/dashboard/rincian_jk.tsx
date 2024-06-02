import React, {useEffect, useState} from 'react';
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";

const fetcher = async (url: string) => {
    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie("token") ?? "xxx"
        }
    });
    return res.data;
}


const RJK = ({data}: any) => {
    const {
        data: jk,
        error,
        isLoading
    } = useSWR('/api/spesifikdata/jk', fetcher, {refreshInterval: 3000});

    const persen = (jumlah: number) => {
        const total = (jk.putra ?? 0) + (jk.putri ?? 0);
        return `${Math.round((jumlah / total) * 100)}%`;
    }
    return (
        <>
            {jk && (
                <div className={"w-full md:w-1/2 my-3 md:mx-3"}>
                    <p className={"m-3 text-2xl"}>Detail Data Jenis Kelamin:</p>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped mb-3">
                            <thead>
                            <tr>
                                <th scope="col">Jenis Kelamin</th>
                                <th scope="col">Jumlah</th>
                                <th scope="col">Persentase</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Putra</td>
                                <td>{jk.putra} Santri</td>
                                <td>{persen(jk.putra ?? 0)}</td>
                            </tr>
                            <tr>
                                <td>Putri</td>
                                <td>{jk.putri} Santri</td>
                                <td>{persen(jk.putri ?? 0)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default RJK;