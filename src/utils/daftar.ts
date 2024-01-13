import axios from "axios";
import prisma from "@/utils/prisma";

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
    try {
        const cek = await axios.post("/api/daftar", data);
        return {
            success: cek.data.success,
            data: {
                siswa: cek.data.datasiswa,
                alamat: cek.data.dataalamat
            },
            message: cek.data.message
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Gagal mendaftar"
        }
    }
};

export default Daftarpsb;