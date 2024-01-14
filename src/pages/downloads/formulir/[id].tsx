import React from 'react';
import {useRouter} from 'next/router';
import axios from "axios";
import useSWR from "swr";
import moment from 'moment';
import 'moment/locale/id';
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import createFormulirPDF from "@/utils/createFormulirPDF";
import Formulir from "@/components/card/formulir";

moment.locale('id');
const DownloadFormulir = () => {
    const router = useRouter();
    const {id} = router.query;

    const siswa = async (url: string) => {
        const res = await axios.post(url, {id: id});
        return res.data;

    }

    const {data, isLoading, error} = useSWR(id ? '/api/cek/siswa' : null, siswa);
    const formatDate = (createdAt: string) => {
        return moment(createdAt).format('DD MMMM YYYY | hh:mm:ss A');
    };

    if (error) {
        LoadingTimer("Formulir Pendaftaran Tidak Valid", "error", 1500);
        return (
            <div className="alert alert-danger" role="alert">
                <h1 className="alert-heading">Data Tidak Ditemukan</h1>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Mengecek Data...</span>
                </div>
            </div>
        );
    }
    const orang = data.data;

    if (orang) {
        LoadingTimer("Formulir Pendaftaran Valid", "success", 1500);
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <center>
                    <div className="flex-col">
                        <div className="card w-full md:w-1/2">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h2 className="card-title">Formulir Pendaftaran Valid</h2>
                                        <button
                                            className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-full my-3 md:mx-3"
                                            onClick={async () => {
                                                try {
                                                    showWaitLoading("Membuat bukti pendaftaran.")
                                                    const {data} = (await axios.post("/api/cek/siswa", {id: orang.id})).data;
                                                    await createFormulirPDF(data);
                                                    await LoadingTimer("Formulir pendaftaran berhasil di buat.", "success", 3000);
                                                } catch (e) {
                                                    await LoadingTimer("Formulir pendaftaran gagal di buat.", "error", 3000);
                                                }
                                            }}
                                        >
                                            Download Formulir Pendaftaran
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <center>
                            <div className="card w-full md:w-1/2">
                                <Formulir data={orang}/>
                            </div>
                        </center>
                    </div>
                </center>
            </div>
        </div>
    );
};

export default DownloadFormulir;