import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment from "moment/moment";
import 'moment/locale/id';
import {Pesan, Bot} from "@/utils/telegram/chat";

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
    if (!req.body.gambar_id) {
        return {
            status: 400,
            data: {
                success: false,
                message: "gambar_id tidak ada",
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
    const bot = await Bot();
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
        const pembayaran = await prisma.pembayaran.create({
            data: {
                bukti: gambar_id,
                status: "menunggu",
            }
        });
        const id_pembayaran = pembayaran.id;
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
            const update_santri_panitia = await prisma.siswa.update({
                where: {id: santri?.id},
                data: {
                    pembayaranId: id_pembayaran,
                    panitiaId: panitia.id
                }
            });
            pesan = pesan + `Nama : ${santri?.nama}\n`;
            pesan = pesan + `Nomor Pendaftaran : ${santri?.nomor}\n`;
            pesan = pesan + `Kode Login : ${santri?.kode}\n`;
            pesan = pesan + `Waktu Pembayaran : ${formatDate(santri?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang : ${santri?.gelombang?.nama}\n`;
            pesan = pesan + `Biaya Pendaftaran : ${santri?.gelombang?.biaya}\n`;
            pesan = pesan + `Metode Pembayaran : Via Panitia (${panitia.nama})\n`;
            pesan = pesan + `Telah mengupload bukti pembayaran, Silahkan pilih tindakan`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            const sendPhotoPromises = idtele.map(async (telegramId) => {
                try {
                    await bot.telegram.sendPhoto(telegramId, imgurl, {
                        caption: pesan,
                        reply_markup: {
                            inline_keyboard: [
                                button1,
                            ]
                        }
                    });
                    console.log(`Message sent successfully to ${telegramId}`);
                } catch (e) {
                    console.log(`Error sending message to ${telegramId}:`, e);
                    throw e;
                }
            });

            try {
                await Promise.all(sendPhotoPromises);
                console.log("semua notif berhasil dikirim.");
            } catch (error) {
                console.error("gagal mengirim notif:", error);
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
            pesan = pesan + `Biaya Pendaftaran : ${santri?.gelombang?.biaya}\n`;
            pesan = pesan + `Metode Pembayaran : Via Transfer\n`;
            pesan = pesan + `Telah mengupload bukti pembayaran, Silahkan pilih tindakan`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            const sendPhotoPromises = idtele.map(async (telegramId) => {
                try {
                    await bot.telegram.sendPhoto(telegramId, imgurl, {
                        caption: pesan,
                        reply_markup: {
                            inline_keyboard: [
                                button1,
                            ]
                        }
                    });
                    console.log(`Message sent successfully to ${telegramId}`);
                } catch (e) {
                    console.log(`Error sending message to ${telegramId}:`, e);
                    throw e;
                }
            });

            try {
                await Promise.all(sendPhotoPromises);
                console.log("semua notif berhasil dikirim.");
            } catch (error) {
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