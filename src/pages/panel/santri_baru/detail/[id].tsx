import React from 'react';
import PanelContent from "@/components/panelContent";
import Template from "@/components/template/admin/template";
import {useRouter} from "next/router";
import useSWR from "swr";
import axios from "axios";
import {getCookie} from "cookies-next";
import Spinner from "@/components/spinner";
import {CldImage} from "next-cloudinary";
import Swal from "sweetalert2";
import {LoadingTimer, showWaitLoading} from "@/components/loading/waitLoading";
import {useUserStore} from "@/utils/stores/user";
import UploadComponent from "@/components/santri/pembayaran/uploadComponent";
import Biodata from "@/components/santri/biodata";
import moment from "moment";

const fetcher = async (url: string) => {
    const res = await axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getCookie("token")}`
        }
    });
    return res.data.data;
}
const Detail = () => {
    const {role, username} = useUserStore();
    const query = useRouter().query;
    const {data: santri, isLoading, error} = useSWR(query.id ? `/api/cek/siswa/${query.id}` : null, fetcher);
    const formatDate = (createdAt: string) => {
        return moment(createdAt).format("DD MMMM YYYY");
    };
    return (
        <Template>
            <PanelContent title={"Detail Santri"}>
                {isLoading && (
                    <div id="loading" className="loading-container">
                        <Spinner text={"Megambil Data."}/>
                    </div>
                )}
                {error && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-700">Terhadi Kesalahan</h1>
                    </>
                )}
                {santri && (
                    <div className="container">
                        <div className="row">
                            {santri.biodata ? (
                                    <>
                                        <div className="col-sm-12">
                                            <h2 className="card-title">Biodata Pendaftar :</h2>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                    <tr>
                                                        <td style={{width: "25%"}}>Nomor Peserta</td>
                                                        <td>: {santri.nomor}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Kode Login</td>
                                                        <td>: {santri.kode}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nama Lengkap</td>
                                                        <td>: {santri.nama.toUpperCase()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Jenis Kelamin</td>
                                                        <td>
                                                            :{" "}
                                                            {santri.jk === "lk"
                                                                ? "Laki - laki"
                                                                : "Perampuan"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>TTL</td>
                                                        <td>
                                                            : {santri.biodata.tempat_lahir},{" "}
                                                            {formatDate(santri.biodata.tanggal)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Provinsi</td>
                                                        <td>: {santri.alamat.provinsi}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Kabupaten / Kota</td>
                                                        <td>: {santri.alamat.kabkot}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Kecamatan</td>
                                                        <td>: {santri.alamat.kecamatan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Desa / Kelurahan</td>
                                                        <td>: {santri.alamat.keldes}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Detail Alamat</td>
                                                        <td>
                                                            :{" "}
                                                            {`RT ${santri.alamat.rt} RW ${santri.alamat.rw}, ${santri.alamat.alamat}`}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nomor HP</td>
                                                        <td>: {santri.hp}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="col-sm-12">
                                            <h2 className="card-title">Informasi Pendaftaran:</h2>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                    <tr>
                                                        <td style={{width: "25%"}}>Informasi Pendaftaran</td>
                                                        <td>: {santri.ip}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Gelombang Pendaftaran</td>
                                                        <td>: {santri.gelombang.nama}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Durasi</td>
                                                        <td>: {santri.gelombang.keterangan}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Waktu pendaftaran</td>
                                                        <td>: {formatDate(santri.created_at)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Biaya</td>
                                                        <td>: {santri.gelombang.biaya}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Metode Pembayaran</td>
                                                        <td>
                                                            :{" "}
                                                            {santri.panitia
                                                                ? `Via Panitia (${santri.panitia.nama})`
                                                                : "Transfer"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status Pembayaran</td>
                                                        <td>: {santri.pembayaran.status}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Terverifikasi</td>
                                                        <td>
                                                            : {formatDate(santri.pembayaran.updated_at)}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="col-sm-12">
                                            <h2 className="card-title">Informasi Akademik:</h2>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                    <tr>
                                                        <td style={{width: "25%"}}>Sekolah Asal</td>
                                                        <td>: {santri.sekolah}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>NPSN</td>
                                                        <td>: {santri.biodata.npsn}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Alamat Sekolah Asal</td>
                                                        <td>: {santri.biodata.alamat_sekolah}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>NISN</td>
                                                        <td>: {santri.biodata.npsn}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Penerima KIP</td>
                                                        <td>: {santri.biodata.kip !== null ? (santri.biodata.kip === true ? "Ya" : "Tidak") : ""}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="col-sm-12">
                                            <h2 className="card-title">Data Ayah Pendaftar:</h2>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                    <tr>
                                                        <td style={{width: "25%"}}>Nama</td>
                                                        <td>: {santri.biodata.nama_ayah}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>NIK</td>
                                                        <td>: {santri.biodata.nik_ayah}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pendidikan Terakhir</td>
                                                        <td>: {santri.biodata.pendidikan_ayah}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pekerjaan</td>
                                                        <td>: {santri.biodata.pekerjaan_ayah}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="col-sm-12">
                                            <h2 className="card-title">Data Ibu Pendaftar:</h2>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                    <tr>
                                                        <td style={{width: "25%"}}>Nama</td>
                                                        <td>: {santri.biodata.nama_ibu}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>NIK</td>
                                                        <td>: {santri.biodata.nik_ibu}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pendidikan Terakhir</td>
                                                        <td>: {santri.biodata.pendidikan_ibu}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pekerjaan</td>
                                                        <td>: {santri.biodata.pekerjaan_ibu}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                ) :
                                (
                                    <>
                                        <center>
                                            <h3>Detail Santri:</h3>
                                        </center>
                                        <table className="table table-bordered mb-3">
                                            <tbody>
                                            <tr>
                                                <td style={{width: "30%"}}>Nomor Pendaftaran</td>
                                                <td style={{width: "70%"}}>{santri.nomor}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Kode</td>
                                                <td style={{width: "70%"}}>{santri.kode}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Nama</td>
                                                <td style={{width: "70%"}}>{santri.nama.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Nomor HP</td>
                                                <td style={{width: "70%"}}>{santri.hp}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Sekolah Asal</td>
                                                <td style={{width: "70%"}}>{santri.sekolah.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Informasi Pendaftaran</td>
                                                <td style={{width: "70%"}}>{santri.ip.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Alamat</td>
                                                <td style={{width: "70%"}}>{santri.alamat.alamat} RT {santri.alamat.rt} RW {santri.alamat.rw}, {santri.alamat.keldes} - {santri.alamat.keldes} - {santri.alamat.kabkot} - {santri.alamat.provinsi}</td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <center>
                                            <h3>Informasi Gelombang:</h3>
                                        </center>
                                        <table className="table table-bordered mb-3">
                                            <tbody>
                                            <tr>
                                                <td style={{width: "30%"}}>Jenis</td>
                                                <td style={{width: "70%"}}>{santri.gelombang.nama.toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Durasi</td>
                                                <td style={{width: "70%"}}>{santri.gelombang.keterangan}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Biaya</td>
                                                <td style={{width: "70%"}}>{santri.gelombang.biaya}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Status Pembayaran</td>
                                                <td style={{width: "70%"}}>{handleStatusPembayaran(santri)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{width: "30%"}}>Metode Pembayaran</td>
                                                <td style={{width: "70%"}}>{handleMetodePembayaran(santri)}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}

                            {
                                santri.pembayaran ? (
                                    <>
                                        <center>
                                            <h3>Bukti Pembayaran:</h3>
                                            <CldImage
                                                alt={'bukti'}
                                                src={santri.pembayaran.bukti}
                                                width={1500}
                                                height={1000}
                                                className={"mb-3"}
                                                style={
                                                    {
                                                        objectFit: "contain",
                                                        width: "auto",
                                                        height: "40vh"
                                                    }
                                                }
                                            />
                                        </center>
                                        {santri.pembayaran.status === 'menunggu' && role === "admin" && (
                                            <div className={"flex flex-col md:flex-row justify-center mb-2"}>
                                                <button className={"btn btn-primary m-2"} onClick={() => {
                                                    handleterima(santri)
                                                }}>Terima
                                                </button>
                                                <button className={"btn btn-danger m-2"} onClick={() => {
                                                    handleTolak(santri)
                                                }}>Tolak
                                                </button>
                                            </div>
                                        )}
                                        {santri.pembayaran.status === 'Lunas' && (
                                            <div>
                                                {santri.biodata ? (
                                                    <Biodata name={"Edit Biodata"} santri={santri}/>
                                                ) : (
                                                    <Biodata name={"Isi Biodata"} santri={santri}/>
                                                )}
                                            </div>
                                        )}

                                    </>
                                ) : (
                                    <>
                                        <center>
                                            <h3>Bantu Pembayaran:</h3>
                                        </center>
                                        <UploadComponent data={username} santri={santri}/>
                                    </>
                                )}
                        </div>
                    </div>
                )}
            </PanelContent>
        </Template>
    );
};

const handleterima = (santri: any) => {
    Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Data Pembayaran atas nama " + santri.nama + " akan diterima dan tidak dapat diubah lagi.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Terima!',
        cancelButtonText: 'Batal',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                showWaitLoading("Memproses penerimaan pembayaran.")
                await axios.post(`/api/santri/pembayaran`, {status: "terima", id: santri.id}, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                });
                await LoadingTimer("Data Pembayaran atas nama " + santri.nama + " telah diterima.", "success", 1500);
                window.location.reload();
            } catch (e) {
                console.log(e)
                await LoadingTimer("Terjadi Kesalahan.", "error", 1500);
            }
        }
    })

}
const handleTolak = (santri: any) => {
    Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Data Pembayaran atas nama " + santri.nama + " akan ditolak dan akan di reset ke awal (belum melakukan pembayaran).",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Tolak!',
        cancelButtonText: 'Batal',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.post(`/api/santri/pembayaran`, {status: "tolak", id: santri.id}, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getCookie("token")}`
                    }
                });
                await LoadingTimer("Data Pembayaran atas nama " + santri.nama + " telah ditolak.", "success", 1500);
                window.location.reload();
            } catch (e) {
                console.log(e)
                await LoadingTimer("Terjadi Kesalahan.", "error", 1500);
            }
        }
    })
}

const handleStatusPembayaran = (santri: any) => {
    if (!santri.pembayaran) {
        return 'Belum Melakukan Pembayaran'
    } else if (santri.pembayaran.status === 'menunggu') {
        return 'Menunggu Verifikasi Pembayaran'
    } else {
        return santri.pembayaran.status
    }
}

const handleMetodePembayaran = (santri: any) => {
    if (!santri.pembayaran) {
        return 'Belum Melakukan Pembayaran'
    } else if (santri.pembayaran.status === 'menunggu') {
        if (santri.panitia) {
            return `Panitia (${santri.panitia.nama})`
        } else {
            return 'Transfer'
        }
    } else if (santri.pembayaran.status === 'Lunas') {
        if (santri.panitia) {
            return `Panitia (${santri.panitia.nama})`
        } else {
            return 'Transfer'
        }
    } else {
        return 'Terjadi Kesalahan'
    }
}

export default Detail;