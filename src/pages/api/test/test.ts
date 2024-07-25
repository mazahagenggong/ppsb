import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import moment from "moment/moment";
import 'moment/locale/id';
import prisma from "@/utils/prisma";

moment.locale('id');

const postdata = async function (req: NextApiRequest) {
    try {
        const sd = await prisma.siswa.findMany({
            include: {
                alamat: true,
                biodata: true,
                pembayaran: true,
                panitia: true,
                gelombang: true,
                prestasi: true
            }
        })
        let nd: any = [];
        let umum: any = [];
        let pk: any = [];
        sd.forEach((item, index) => {
            const ttl = () => {
                let hasil;
                if (item?.biodata?.tempat_lahir && item?.biodata?.tanggal_lahir) {
                    const tl = item?.biodata?.tanggal_lahir;
                    hasil = `${item?.biodata?.tempat_lahir}, ${moment(tl).format("DD MMMM YYYY")}`;
                } else {
                    hasil = ""
                }
                return hasil
            }
            const satdat: any = {
                nomor_peserta: item.nomor,
                kode: item.kode,
                nama: item.nama,
                nik: item.biodata?.nik ?? "",
                jenis_kelamin: item.jk,
                tempat_tanggal_lahir: ttl(),
                informasi_pendaftaran: item.ip,
                nomor_hp: item.hp,
                alamat: `${item?.alamat?.alamat} rt ${item?.alamat?.rt} rw ${item?.alamat?.rw},${item?.alamat?.keldes} - ${item?.alamat?.kecamatan} - ${item?.alamat?.kabkot} - ${item?.alamat?.provinsi}`,
                gelombang: item?.gelombang?.nama,
                jalur_pendaftaran: item.prestasi ? "Gratis " + item.prestasi.jenis : "Berbayar (" + item?.gelombang?.biaya + ")",
                status_pembayaran: item?.pembayaran?.status ?? "Belum Bayar"
            };
            if (item?.biodata?.jurusan) {
                satdat.jurusan = item?.biodata?.jurusan
            } else if (item.prejur) {
                satdat.jurusan = item.prejur
            } else {
                satdat.jurusan = "Belum Di Pilih"
            }
            satdat.sekolah_asal = item.sekolah
            if (item.biodata) {
                satdat.alamat_sekolah = item.biodata.alamat_sekolah ?? ""
                satdat.npsn_sekolah = item.biodata.npsn ?? ""
                satdat.nisn = item.biodata.nisn ?? ""
                satdat.jumlah_saudara = item.biodata.jumlah_saudara
                satdat.anak_ke = item.biodata.anak_ke
                satdat.nama_ayah = item.biodata.nama_ayah ?? ""
                satdat.nik_ayah = item.biodata.nik_ayah ?? ""
                satdat.pendidikan_ayah = item.biodata.pendidikan_ayah ?? ""
                satdat.pekerjaan_ayah = item.biodata.pekerjaan_ayah ?? ""
                satdat.nama_ibu = item.biodata.nama_ibu ?? ""
                satdat.nik_ibu = item.biodata.nik_ibu ?? ""
                satdat.pendidikan_ibu = item.biodata.pendidikan_ibu ?? ""
                satdat.pekerjaan_ibu = item.biodata.pekerjaan_ibu ?? ""
            } else {
                satdat.alamat_sekolah = ""
                satdat.npsn_sekolah = ""
                satdat.nisn = ""
                satdat.kip = ""
                satdat.jumlah_saudara = ""
                satdat.anak_ke = ""
                satdat.nama_ayah = ""
                satdat.nik_ayah = ""
                satdat.pendidikan_ayah = ""
                satdat.pekerjaan_ayah = ""
                satdat.nama_ibu = ""
                satdat.nik_ibu = ""
                satdat.pendidikan_ibu = ""
                satdat.pekerjaan_ibu = ""
            }
            if (satdat.jurusan === "UMUM"){
                umum.push(satdat);
            }
            if (satdat.jurusan === "PK"){
                pk.push(satdat);
            }
            nd.push(satdat);
        })
        // return {
        //     status: 200,
        //     data: umum
        // }
        return {
            status: 200,
            data: {page: "test page"}
        }

    } catch (e) {
        return {
            status: 401,
            data: {
                success: false,
                message: "error",
                error: e
            }
        }
    }
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cors = Cors({
        methods: ['GET'],
    })

    await runMiddleware(req, res, cors);

    switch (req.method) {
        case "GET" :
            const data = await postdata(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}