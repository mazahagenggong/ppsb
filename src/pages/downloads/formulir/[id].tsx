import React from 'react';
import {useRouter} from 'next/router';
import axios from "axios";
import useSWR from "swr";
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');
const DownloadFormulir = () => {
    const router = useRouter();
    const {id} = router.query;

    const siswa = async (url: string) => {
        const res = await axios.post(url, {id: id});
        return res.data;

    }

    const {data, isLoading, error} = useSWR(id ? '/api/cek/siswa' : null, siswa);
    const url = `https://ppsb.mazainulhasan1.sch.id/downloads/formulir/${id}`;
    const formatDate = (createdAt: string) => {
        return moment(createdAt).format('DD MMMM YYYY | hh:mm:ss A');
    };
    if (!id) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Mengecek Data...</span>
                </div>
            </div>
        );
    }

    if (error) {
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

    const {alamat} = data.data;
    const orang = data.data;

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-12">
                                <h2 className="card-title">Data Pendaftar :</h2>
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td>Kode Login</td>
                                            <td>: {orang.kode}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Lengkap</td>
                                            <td>: {orang.nama.toUpperCase()}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Kelamin</td>
                                            <td>: {orang.jk === "lk" ? "Laki - laki" : "Perampuan"}</td>
                                        </tr>
                                        <tr>
                                            <td>Nomor HP</td>
                                            <td>: {orang.hp}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr/>
                            <div className="col-sm-12">
                                <h2 className="card-title">Alamat Pendaftar :</h2>
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td>Provinsi</td>
                                            <td>: {alamat.provinsi}</td>
                                        </tr>
                                        <tr>
                                            <td>Kabupaten / Kota</td>
                                            <td>: {alamat.kabkot}</td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>: {alamat.kecamatan}</td>
                                        </tr>
                                        <tr>
                                            <td>Desa / Kelurahan</td>
                                            <td>: {alamat.keldes}</td>
                                        </tr>
                                        <tr>
                                            <td>Detail Alamat</td>
                                            <td>: {`RT ${alamat.rt} RW ${alamat.rw}, ${alamat.alamat}`}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <hr/>
                            <div className="col-sm-12">
                                <h2 className="card-title">Informasi Tambahan:</h2>
                                <div className="table-responsive">
                                    <table className="table">
                                        <tbody>
                                        <tr>
                                            <td>Sekolah Asal</td>
                                            <td>: {orang.sekolah}</td>
                                        </tr>
                                        <tr>
                                            <td>Informasi Pendaftaran</td>
                                            <td>: {orang.ip}</td>
                                        </tr>
                                        <tr>
                                            <td>Waktu pendaftaran</td>
                                            <td>: {formatDate(orang.created_at)}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadFormulir;