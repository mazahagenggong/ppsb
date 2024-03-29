import type {NextApiRequest, NextApiResponse} from 'next';
import Cors from 'cors';
import runMiddleware from "@/utils/runMiddleware";
import {Admin} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import {KirimFotoSekret, KirimPribadi, Pesan} from "@/utils/telegram/chat";
import moment from "moment";
import 'moment/locale/id';

moment.locale('id');
const formatDate = (createdAt: any) => {
    if (createdAt) {
        return moment(createdAt).format('DD MMMM YYYY');
    } else {
        return "";
    }
};
const getdata = async function (req: NextApiRequest) {
    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY');
    const token = req.cookies.token ?? null;
    if (!token) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Oooops, Sepertinya anda belum login sebagai admin",
            }
        };
    }
    const cek_token = await Admin(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: "Oooops, Sepertinya anda belum login sebagai admin",
            }
        };
    }
    const reqquery = req.query;
    if (!reqquery.id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "id tidak ada",
            }
        };
    }
    const id = reqquery.id as string;
    try {
        try {
            const update = await prisma.siswa.update({
                where: {
                    id: id
                },
                data: {
                    pembayaran: {
                        update: {
                            status: "Lunas"
                        }
                    }
                }
            })
            const siswa = await prisma.siswa.findUnique({
                where: {
                    id: id
                },
                include: {
                    alamat: true,
                    pembayaran: true,
                    panitia: true,
                    gelombang: true,
                    prestasi:true,
                }
            })
            let pesan = `Nama : ${siswa?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${siswa?.nomor}\n`;
            pesan = pesan + `Kode Login : ${siswa?.kode}\n`;
            pesan = pesan + `Jenis Kelamin : ${siswa?.jk === "lk" ? "Laki - Laki" : "Perempuan"}\n`;
            pesan = pesan + `Pilihan Jurusan : ${siswa?.prejur}\n`;
            pesan = pesan + `Sekolah Asal : ${siswa?.sekolah}\n`;
            pesan = pesan + `Informasi Pendaftaran : ${siswa?.ip}\n`;
            pesan = pesan + `Nomor HP : ${siswa?.hp}\n`;
            pesan = pesan + `Alamat : ${siswa?.alamat?.alamat} RT ${siswa?.alamat?.rt} RW ${siswa?.alamat?.rw} - ${siswa?.alamat?.keldes},  ${siswa?.alamat?.kecamatan}  - ${siswa?.alamat?.kabkot} - ${siswa?.alamat?.provinsi}\n`;
            pesan = pesan + `Waktu Pembayaran : ${formatDate(siswa?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang : ${siswa?.gelombang?.nama}\n`;
            if (siswa?.prestasi){
                let pres;
                switch (siswa.prestasi.jenis) {
                    case "tahfidz":
                        pres = "Tahfidz 5 juz"
                        break;
                    case "alfiyah":
                        pres = "Hafal nadzam alfiyah 500 bait"
                        break;
                    case "porseni":
                        pres = "Juara Porseni minimal tingkat kabupaten"
                        break;
                    case "peringkat_kelas":
                        pres = "Peringkat 1 - 3 di kelas 9"
                        break;
                    case "prestasi_internal":
                        pres = "Prestasi Internal Zainul Hasan"
                        break;
                    default:
                        pres = "unknown error"
                }
                pesan = pesan + `Biaya Pendaftaran : Gratis (Prestasi)\n`;
                pesan = pesan + `Jenis Prestasi : ${pres} ${siswa?.panitia?.nama ? '- Panitia (' + siswa?.panitia?.nama + ')' : ''}\n`;
            } else {
                pesan = pesan + `Biaya Pendaftaran : ${siswa?.gelombang?.biaya}\n`;
                pesan = pesan + `Metode Pembayaran : Via ${siswa?.panitia?.nama ? 'Panitia (' + siswa?.panitia?.nama + ')' : 'Transfer'}\n`;
            }
            pesan = pesan + `Status Pembayaran : Lunas\n`;
            pesan = pesan + `Telah mendaftar dan melakukan pembayaran`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            const cdname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
            const imgurl = `https://res.cloudinary.com/${cdname}/${siswa?.pembayaran?.bukti}`;
            try {
                await KirimFotoSekret(pesan, imgurl);
                console.log(`Message sent successfully`);
            } catch (e) {
                const pesan = `dari psb: \n${JSON.stringify(e)}`;
                await KirimPribadi(pesan);
                console.log(`Error sending message :`, e);
            }
            return {
                status: 200,
                data: {
                    success: true,
                    data: siswa,
                    message: "Berhasil memverifikasi pembayaran",
                }
            }
        } catch (e) {
            console.log(e)
            return {
                status: 500,
                data: {
                    success: false,
                    message: "terjadi kesalahan",
                }
            }
        }
    } finally {
        prisma.$disconnect();
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
            const data = await getdata(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}