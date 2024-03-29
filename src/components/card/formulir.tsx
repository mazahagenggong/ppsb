import React from 'react';
import moment from "moment/moment";

const Formulir = (data: any) => {
    const {data: dataSantri} = data;
    const formatDate = (createdAt: string) => {
        return moment(createdAt).format("DD MMMM YYYY");
    };
    return (
        <>
            <div className="card w-full">
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm-12">
                            <h2 className="card-title">Biodata Pendaftar :</h2>
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                    <tr>
                                        <td style={{width: "25%"}}>Nomor Peserta</td>
                                        <td>: {dataSantri.nomor}</td>
                                    </tr>
                                    <tr>
                                        <td>Kode Login</td>
                                        <td>: {dataSantri.kode}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama Lengkap</td>
                                        <td>: {dataSantri.nama.toUpperCase()}</td>
                                    </tr>
                                    <tr>
                                        <td>Jenis Kelamin</td>
                                        <td>
                                            :{" "}
                                            {dataSantri.jk === "lk"
                                                ? "Laki - laki"
                                                : "Perampuan"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>TTL</td>
                                        <td>
                                            : {dataSantri.biodata.tempat_lahir},{" "}
                                            {formatDate(dataSantri.biodata.tanggal)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Provinsi</td>
                                        <td>: {dataSantri.alamat.provinsi}</td>
                                    </tr>
                                    <tr>
                                        <td>Kabupaten / Kota</td>
                                        <td>: {dataSantri.alamat.kabkot}</td>
                                    </tr>
                                    <tr>
                                        <td>Kecamatan</td>
                                        <td>: {dataSantri.alamat.kecamatan}</td>
                                    </tr>
                                    <tr>
                                        <td>Desa / Kelurahan</td>
                                        <td>: {dataSantri.alamat.keldes}</td>
                                    </tr>
                                    <tr>
                                        <td>Detail Alamat</td>
                                        <td>
                                            :{" "}
                                            {`RT ${dataSantri.alamat.rt} RW ${dataSantri.alamat.rw}, ${dataSantri.alamat.alamat}`}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Nomor HP</td>
                                        <td>: {dataSantri.hp}</td>
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
                                        <td style={{width: "25%"}}>Pilihan Jurusan</td>
                                        <td>: {dataSantri.biodata.jurusan}</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: "25%"}}>Informasi Pendaftaran</td>
                                        <td>: {dataSantri.ip}</td>
                                    </tr>
                                    <tr>
                                        <td>Gelombang Pendaftaran</td>
                                        <td>: {dataSantri.gelombang.nama}</td>
                                    </tr>
                                    <tr>
                                        <td>Durasi</td>
                                        <td>: {dataSantri.gelombang.keterangan}</td>
                                    </tr>
                                    <tr>
                                        <td>Waktu pendaftaran</td>
                                        <td>: {formatDate(dataSantri.created_at)}</td>
                                    </tr>
                                    <tr>
                                        <td>Biaya</td>
                                        <td>: {dataSantri.gelombang.biaya}</td>
                                    </tr>
                                    <tr>
                                        <td>Metode Pembayaran</td>
                                        <td>
                                            :{" "}
                                            {dataSantri.panitia
                                                ? `Via Panitia (${dataSantri.panitia.nama})`
                                                : "Transfer"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Status Pembayaran</td>
                                        <td>: {dataSantri.pembayaran.status}</td>
                                    </tr>
                                    <tr>
                                        <td>Terverifikasi</td>
                                        <td>
                                            : {formatDate(dataSantri.pembayaran.updated_at)}
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
                                        <td  style={{width: "25%"}}>Sekolah Asal</td>
                                        <td>: {dataSantri.sekolah}</td>
                                    </tr>
                                    <tr>
                                        <td>NPSN</td>
                                        <td>: {dataSantri.biodata.npsn}</td>
                                    </tr>
                                    <tr>
                                        <td>Alamat Sekolah Asal</td>
                                        <td>: {dataSantri.biodata.alamat_sekolah}</td>
                                    </tr>
                                    <tr>
                                        <td>NISN</td>
                                        <td>: {dataSantri.biodata.npsn}</td>
                                    </tr>

                                    <tr>
                                        <td>Penerima KIP</td>
                                        <td>: {dataSantri.biodata.kip !== null ? (dataSantri.biodata.kip === true ? "Ya" : "Tidak") : ""}</td>
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
                                        <td>: {dataSantri.biodata.nama_ayah}</td>
                                    </tr>
                                    <tr>
                                        <td>NIK</td>
                                        <td>: {dataSantri.biodata.nik_ayah}</td>
                                    </tr>
                                    <tr>
                                        <td>Pendidikan Terakhir</td>
                                        <td>: {dataSantri.biodata.pendidikan_ayah}</td>
                                    </tr>
                                    <tr>
                                        <td>Pekerjaan</td>
                                        <td>: {dataSantri.biodata.pekerjaan_ayah}</td>
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
                                        <td>: {dataSantri.biodata.nama_ibu}</td>
                                    </tr>
                                    <tr>
                                        <td>NIK</td>
                                        <td>: {dataSantri.biodata.nik_ibu}</td>
                                    </tr>
                                    <tr>
                                        <td>Pendidikan Terakhir</td>
                                        <td>: {dataSantri.biodata.pendidikan_ibu}</td>
                                    </tr>
                                    <tr>
                                        <td>Pekerjaan</td>
                                        <td>: {dataSantri.biodata.pekerjaan_ibu}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Formulir;