import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import {KirimPesan} from "@/utils/telegram/chat";
import moment from "moment/moment";

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
            const pesan = `Santri ${santri?.nama} (${santri?.nomor}) mengupload bukti pembayaran via panitia ${panitia.nama} (${panitia.username})\n silahkan cek di aplikasi`;
            await KirimPesan({
                bot_token,
                id: idtele,
                pesan: pesan + "\n",
                pengirim: server,
                waktu: date,
            });
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
            });const pesan = `Santri ${santri?.nama} (${santri?.nomor}) mengupload bukti pembayaran via transfer\n silahkan cek di aplikasi`;
            await KirimPesan({
                bot_token,
                id: idtele,
                pesan: pesan + "\n",
                pengirim: server,
                waktu: date,
            });
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