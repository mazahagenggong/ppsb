import axios from "axios";
import moment from "moment/moment";
import {KirimPribadi, KirimSekret, KirimUtama, Pesan} from "@/utils/telegram/chat";

const nullkat = (jenis: string) => {
    let keterangan;
    switch (jenis) {
        case "nama":
            keterangan = "Nama Lengkap belum di isi";
            break;
        case "jk":
            keterangan = "Jenis Kelamin belum di pilih";
            break;
        case "ip":
            keterangan = "Informasi Pendaftaran belum di pilih";
            break;
        case "prejur":
            keterangan = "Jurusan belum di pilih";
            break;
        case "hp":
            keterangan = "Nomor HP belum di isi";
            break;
        case "sekolah":
            keterangan = "Sekolah Asal belum di isi";
            break;
        case "provinsi":
            keterangan = "Provinsi belum di pilih";
            break;
        case "kabkot":
            keterangan = "Kabupaten / Kota belum di pilih";
            break;
        case "kecamatan":
            keterangan = "Kecamatan belum di pilih";
            break;
        case "keldes":
            keterangan = "Desa / Kelurahan belum di pilih";
            break;
        case "rt":
            keterangan = "RT belum di pilih";
            break;
        case "rw":
            keterangan = "RW belum di pilih";
            break;
        case "alamat":
            keterangan = "Alamat belum di isi";
            break;
        case "gelombang":
            keterangan = "Gelombang tidak valid";
            break;
        default:
            keterangan = "Error";
            break;
    }
    return keterangan;
}

const formatDate = (createdAt: any) => {
    if (createdAt) {
        return moment(createdAt).format('DD MMMM YYYY');
    } else {
        return "";
    }
};
const Daftarpsb = async (data: any) => {
    for (const key in data) {
        if (data[key] === null || data[key] === "") {
            return {
                success: false,
                message: nullkat(key),
            };
        }
    }
    data.provinsi = data.provinsi.split("|")[1];
    data.kabkot = data.kabkot.split("|")[1];
    data.kecamatan = data.kecamatan.split("|")[1];
    const date = moment().format('DD-MM-YYYY');
    try {
        const cek = await axios.post("/api/daftar", data);
        try {
            let pesan = `Nama : ${cek.data.datasiswa?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${cek.data.datasiswa?.nomor}\n`;
            pesan = pesan + `Kode Login : ${cek.data.datasiswa?.kode}\n`;
            pesan = pesan + `Jenis Kelamin : ${cek.data.datasiswa?.jk === "lk" ? "Laki - Laki" : "Perempuan"}\n`;
            pesan = pesan + `Pilihan Jurusan : ${cek.data.datasiswa?.prejur}\n`;
            pesan = pesan + `Sekolah Asal : ${cek.data.datasiswa?.sekolah}\n`;
            pesan = pesan + `Informasi Pendaftaran : ${cek.data.datasiswa?.ip}\n`;
            pesan = pesan + `Nomor HP : ${cek.data.datasiswa?.hp}\n`;
            pesan = pesan + `Alamat : ${cek.data.dataalamat?.alamat} RT ${cek.data.dataalamat?.rt} RW ${cek.data.dataalamat?.rw} - ${cek.data.dataalamat?.keldes},  ${cek.data.dataalamat?.kecamatan}  - ${cek.data.dataalamat?.kabkot} - ${cek.data.dataalamat?.provinsi}\n`;
            pesan = pesan + `Waktu Pendaftaran : ${formatDate(cek.data.datasiswa?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang Pendaftaran: ${cek.data.datasiswa?.gelombang.nama}\n`;
            pesan = pesan + `Biaya Pendaftaran : ${cek.data.datasiswa?.gelombang.biaya}\n`;
            pesan = pesan + `Telah melakukan pendaftaran pada tanggal ${date}\n`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: cek.data.server,
                waktu: date,
            })
            await Promise.all([
                KirimUtama(pesan),
                KirimSekret(pesan),
            ]);
        } catch (e) {
            const pesan = `dari psb: \nutils error\n${JSON.stringify(e)}`;
            await KirimPribadi(pesan);
        }
        return {
            success: true,
            data: {
                siswa: cek.data.datasiswa,
                alamat: cek.data.dataalamat
            },
            message: "berhasil mendaftar"
        }
    } catch (error:any) {
        if (error.response && error.response.status === 400) {
            const pesan = `dari psb: \nutils error\n${JSON.stringify(error.response)}`;
            await KirimPribadi(pesan);
            return {
                success: false,
                message: error.response.data.message,
                error: error
            };
        } else {
            const pesan = `dari psb: \nutils error\n${JSON.stringify(error)}`;
            await KirimPribadi(pesan);
            return {
                success: false,
                message: "Gagal mendaftar",
                error: error
            }
        }

    }
};

export default Daftarpsb;