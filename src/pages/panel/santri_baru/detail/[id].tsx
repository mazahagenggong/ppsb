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

                            {santri.pembayaran ? (
                                <>
                                    <center>
                                        <h3>Bukti Pembayaran:</h3>
                                    </center>
                                    <CldImage alt={'bukti'} src={santri.pembayaran.bukti} width={1500} height={1000}
                                              className={"mb-3"}/>
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
                                </>
                            ): (
                                <>
                                    <center>
                                        <h3>Bantu Pembayaran:</h3>
                                    </center>
                                    <UploadComponent data={username}/>
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