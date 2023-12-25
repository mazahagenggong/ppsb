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
                        {/*<div className="card w-full md:w-1/2">*/}
                        {/*    <div className="card-body">*/}
                        {/*        <div className="row">*/}
                        {/*            <div className="col-sm-12">*/}
                        {/*                <h2 className="card-title">Data Pendaftar :</h2>*/}
                        {/*                <div className="table-responsive">*/}
                        {/*                    <table className="table">*/}
                        {/*                        <tbody>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Nomor Peserta</td>*/}
                        {/*                            <td>: {orang.nomor}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Kode Login</td>*/}
                        {/*                            <td>: {orang.kode}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Nama Lengkap</td>*/}
                        {/*                            <td>: {orang.nama.toUpperCase()}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Jenis Kelamin</td>*/}
                        {/*                            <td>: {orang.jk === "lk" ? "Laki - laki" : "Perampuan"}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Nomor HP</td>*/}
                        {/*                            <td>: {orang.hp}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        </tbody>*/}
                        {/*                    </table>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <hr/>*/}
                        {/*            <div className="col-sm-12">*/}
                        {/*                <h2 className="card-title">Alamat Pendaftar :</h2>*/}
                        {/*                <div className="table-responsive">*/}
                        {/*                    <table className="table">*/}
                        {/*                        <tbody>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Provinsi</td>*/}
                        {/*                            <td>: {orang.alamat.provinsi}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Kabupaten / Kota</td>*/}
                        {/*                            <td>: {orang.alamat.kabkot}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Kecamatan</td>*/}
                        {/*                            <td>: {orang.alamat.kecamatan}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Desa / Kelurahan</td>*/}
                        {/*                            <td>: {orang.alamat.keldes}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Detail Alamat</td>*/}
                        {/*                            <td>: {`RT ${orang.alamat.rt} RW ${orang.alamat.rw}, ${orang.alamat.alamat}`}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        </tbody>*/}
                        {/*                    </table>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <hr/>*/}
                        {/*            <div className="col-sm-12">*/}
                        {/*                <h2 className="card-title">Informasi Gelombang :</h2>*/}
                        {/*                <div className="table-responsive">*/}
                        {/*                    <table className="table">*/}
                        {/*                        <tbody>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Jenis Gelombang</td>*/}
                        {/*                            <td>: {orang.gelombang.nama}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Durasi</td>*/}
                        {/*                            <td>: {orang.gelombang.keterangan}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Biaya</td>*/}
                        {/*                            <td>: {orang.gelombang.biaya}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        </tbody>*/}
                        {/*                    </table>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*            <hr/>*/}
                        {/*            <div className="col-sm-12">*/}
                        {/*                <h2 className="card-title">Informasi Tambahan:</h2>*/}
                        {/*                <div className="table-responsive">*/}
                        {/*                    <table className="table">*/}
                        {/*                        <tbody>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Sekolah Asal</td>*/}
                        {/*                            <td>: {orang.sekolah}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Informasi Pendaftaran</td>*/}
                        {/*                            <td>: {orang.ip}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        <tr>*/}
                        {/*                            <td>Waktu pendaftaran</td>*/}
                        {/*                            <td>: {formatDate(orang.created_at)}</td>*/}
                        {/*                        </tr>*/}
                        {/*                        </tbody>*/}
                        {/*                    </table>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </center>
            </div>
        </div>
    );
};

export default DownloadFormulir;