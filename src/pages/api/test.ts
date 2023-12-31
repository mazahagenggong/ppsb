import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import {Santri} from "@/utils/validate/token";
import prisma from "@/utils/prisma";
import moment from "moment/moment";
import 'moment/locale/id';
import {Pesan, Bot} from "@/utils/telegram/chat";

moment.locale('id');

const getdata = async function (req: NextApiRequest) {
    const bot_token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
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
    const pesan = await Pesan({
        pesan: `Ada santri yang mengupload bukti pembayaran`,
        waktu: date,
        pengirim: server,
    });
    try {
        await bot.telegram.sendMessage(idtele[0], pesan);
        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil kirim pesan",
            }
        };
    } catch (e) {
        return {
            status: 500,
            data: {
                success: false,
                message: "gagal kirim pesan",
            }
        };

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