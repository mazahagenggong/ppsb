import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment from "moment/moment";
import 'moment/locale/id';
import {Pesan, KirimFotoSekret, KirimPribadi, KirimButtonGambar, KirimFotoPribadi} from "@/utils/telegram/chat";

moment.locale('id');
const formatDate = (createdAt: any) => {
    if (createdAt) {
        return moment(createdAt).format('DD MMMM YYYY');
    } else {
        return "";
    }
};
const post = async function (req: NextApiRequest) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return {
            status: 401,
            data: {
                success: false,
                message: "token tidak ada",
            }
        };
    }
    const cek_token = await Santri(token);
    if (!cek_token.success) {
        return {
            status: 401,
            data: {
                success: false,
                message: cek_token.message,
            }
        };
    }
    if (!req.body.gambar_id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "gambar_id tidak ada",
            }
        };
    }
    const gambar_id = req.body.gambar_id;
    const santri = cek_token.data;
    const admin = await prisma.user.findMany({
        where: {
            role: "admin",
            telegram: {
                not: null
            }
        }
    })

    let idtele: string[] = [];
    const cari_id = admin.map((item) => {
        idtele.push(item?.telegram ?? '799163200');
    })
    await Promise.all(cari_id);
    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY');
    const cdname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
    const imgurl = `https://res.cloudinary.com/${cdname}/${gambar_id}`;
    const button1 = [
        {
            text: "✅ Terima",
            url: `${server}/api/santri/terima_pembayaran/${santri?.id}`
        },
        {
            text: "❌ Tolak",
            url: `${server}/api/santri/tolak_pembayaran/${santri?.id}`
        },
    ]
    let pesan = "";
    try {
        if (req.body.jalur && req.body.prestasi){
            const prestasi = await prisma.prestasi.create({
                data: {
                    jenis: req.body.prestasi
                }
            });
            await prisma.siswa.update({
                where: {id: santri?.id},
                data: {
                    prestasiId: prestasi.id
                }
            });
        }
        if (req.body.panitia) {
            const panitia = await prisma.user.findUnique({
                where: {
                    username: req.body.panitia
                }
            });
            if (!panitia) {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "panitia tidak ada",
                    }
                };
            }
            const pembayaran = await prisma.pembayaran.create({
                data: {
                    bukti: gambar_id,
                    status: "Lunas",
                }
            });
            const id_pembayaran = pembayaran.id;
            const update_santri_panitia = await prisma.siswa.update({
                where: {id: santri?.id},
                data: {
                    pembayaranId: id_pembayaran,
                    panitiaId: panitia.id
                }
            });
            const santrinya = await prisma.siswa.findUnique({
                where: {
                    id: santri?.id
                },
                include: {
                    alamat: true,
                    pembayaran: true,
                    panitia: true,
                    prestasi: true,
                    gelombang: true,
                }
            });
            const server = req.headers.host ?? '';
            const date = moment().format('DD-MM-YYYY');
            let pesan = `Nama : ${santrinya?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${santrinya?.nomor}\n`;
            pesan = pesan + `Kode Login : ${santrinya?.kode}\n`;
            pesan = pesan + `Jenis Kelamin : ${santrinya?.jk === "lk" ? "Laki - Laki" : "Perempuan"}\n`;
            pesan = pesan + `Pilihan Jurusan : ${santrinya?.prejur}\n`;
            pesan = pesan + `Sekolah Asal : ${santrinya?.sekolah}\n`;
            pesan = pesan + `Informasi Pendaftaran : ${santrinya?.ip}\n`;
            pesan = pesan + `Nomor HP : ${santrinya?.hp}\n`;
            pesan = pesan + `Alamat : ${santrinya?.alamat?.alamat} RT ${santrinya?.alamat?.rt} RW ${santrinya?.alamat?.rw} - ${santrinya?.alamat?.keldes},  ${santrinya?.alamat?.kecamatan}  - ${santrinya?.alamat?.kabkot} - ${santrinya?.alamat?.provinsi}\n`;
            pesan = pesan + `Waktu Pembayaran : ${formatDate(santrinya?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang : ${santrinya?.gelombang?.nama}\n`;
            if (santrinya?.prestasi){
                let pres;
                switch (santrinya.prestasi.jenis) {
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
                pesan = pesan + `Jenis Prestasi : ${pres} ${santrinya?.panitia?.nama ? '- Panitia (' + santrinya?.panitia?.nama + ')' : ''}\n`;
            } else {
                pesan = pesan + `Biaya Pendaftaran : ${santrinya?.gelombang?.biaya}\n`;
                pesan = pesan + `Metode Pembayaran : Via ${santrinya?.panitia?.nama ? 'Panitia (' + santrinya?.panitia?.nama + ')' : 'Transfer'}\n`;
            }
            pesan = pesan + `Status Pembayaran : Lunas\n`;
            pesan = pesan + `Telah mendaftar dan melunasi pembayaran`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            const cdname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
            const imgurl = `https://res.cloudinary.com/${cdname}/${santrinya?.pembayaran?.bukti}`;
            try {
                await KirimFotoSekret(pesan, imgurl);
                console.log(`Message sent successfully`);
            } catch (e) {
                await KirimPribadi(`dari psb: \n${JSON.stringify(e)}`);
                console.log(`Error sending message :`, e);
            }
            return {
                status: 200,
                data: {
                    success: true,
                    message: "berhasil mengupload bukti pembayaran",
                    data: update_santri_panitia
                }
            };
        } else {
            const pembayaran = await prisma.pembayaran.create({
                data: {
                    bukti: gambar_id,
                    status: "menunggu",
                }
            });
            const id_pembayaran = pembayaran.id;
            const update_santri = await prisma.siswa.update({
                where: {id: santri?.id},
                data: {
                    pembayaranId: id_pembayaran,
                }
            });
            pesan = pesan + `Nama : ${santri?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${santri?.nomor}\n`;
            pesan = pesan + `Kode Login : ${santri?.kode}\n`;
            pesan = pesan + `Waktu Pembayaran : ${formatDate(santri?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang : ${santri?.gelombang?.nama}\n`;
            if (santri?.prestasi){
                let pres;
                switch (santri.prestasi.jenis) {
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
                pesan = pesan + `Jenis Prestasi : ${pres}\n`;
            } else {
                pesan = pesan + `Biaya Pendaftaran : ${santri?.gelombang?.biaya}\n`;
                pesan = pesan + `Metode Pembayaran : Via Transfer\n`;
            }
            pesan = pesan + `Telah mengupload bukti pembayaran, Silahkan pilih tindakan`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            const sendPhotoPromises = idtele.map(async (telegramId) => {
                try {
                    await KirimButtonGambar(pesan, imgurl, button1, telegramId);
                    console.log(`Message sent successfully to ${telegramId}`);
                } catch (e) {
                    await KirimPribadi(`dari psb: \n${JSON.stringify(e)}`);
                    throw e;
                }
            });

            try {
                await Promise.all(sendPhotoPromises);
                console.log("semua notif berhasil dikirim.");
            } catch (error) {
                const pesan = `dari psb: \n${JSON.stringify(error)}`;
                await KirimPribadi(pesan);
                console.error("gagal mengirim notif:", error);
            }
            return {
                status: 200,
                data: {
                    success: true,
                    message: "berhasil mengupload bukti pembayaran",
                    data: update_santri
                }
            };
        }
    } catch (error: any) {
        return {
            status: 400,
            data: {
                success: false,
                message: "gagal mengupload bukti pembayaran",
            }
        };
    }
}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cors = Cors({
        methods: ['POST'],
    })

    await runMiddleware(req, res, cors);

    switch (req.method) {
        case "POST" :
            const data = await post(req);
            return res.status(data.status).json(data.data);
        default:
            return res.status(404).json({
                error: "halaman tidak ada"
            })
    }
}