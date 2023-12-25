import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment, {now} from "moment/moment";
import 'moment/locale/id';
import {Pesan, Bot, ButtonChat} from "@/utils/telegram/chat";

moment.locale('id');
const formatDate = (createdAt: any) => {
    if (createdAt ) {
        return moment(createdAt).format('DD MMMM YYYY | hh:mm:ss A');
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
    const bot_token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    const idtele = '799163200';
    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY : HH:mm:ss');
    const bot = await Bot({
        bot_token
    })
    const cdname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
    const imgurl = `https://res.cloudinary.com/${cdname}/${gambar_id}`;
    const terima = ButtonChat("✅ Terima", `$server/api/santri/terima_pembayaran/${santri?.id}`);
    const tolak = ButtonChat("❌ Tolak", `$server/api/santri/tolak_pembayaran/${santri?.id}`);
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
            pesan = pesan + `Nama : ${santri?.nama})\n`;
            pesan = pesan + `Nomor Pendaftaran : ${santri?.nomor})\n`;
            pesan = pesan + `Kode Login : ${santri?.kode})\n`;
            pesan = pesan + `Waktu Pembayaran : ${formatDate(santri?.created_at ?? null)}\n`;
            pesan = pesan + `Gelombang : ${santri?.gelombang?.nama})\n`;
            pesan = pesan + `Biaya Pendaftaran : ${santri?.gelombang?.biaya})\n`;
            pesan = pesan + `Metode Pembayaran : ${santri?.panitia ? "Via Panitia (" + santri?.panitia?.nama + ")" : "Via Transfer"})\n`;
            pesan = pesan + `Telah mengupload bukti pembayaran, Silahkan pilih tindakan`;
            pesan = await Pesan({
                pesan: pesan,
                pengirim: server,
                waktu: date,
            })
            try {
                await bot.telegram.sendPhoto(idtele, imgurl, {
                    caption: pesan,
                    reply_markup: {
                        inline_keyboard: [
                            terima,
                            tolak
                        ]
                    }
                })
            } catch (e) {
                console.log(e);
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
            pesan = await Pesan({
                pesan: `Santri ${santri?.nama} (${santri?.nomor}) mengupload bukti pembayaran via transfer\nKlik detail untuk melihat bukti pembayaran dan melalukan verifikasi`,
                pengirim: server,
                waktu: date,
            })
            try {
                await bot.telegram.sendPhoto(idtele, imgurl, {
                    caption: pesan,
                    reply_markup: {
                        inline_keyboard: [
                            terima,
                            tolak
                        ]
                    }
                })
            } catch (e) {
                console.log(e);
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