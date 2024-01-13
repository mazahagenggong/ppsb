import type {NextApiRequest, NextApiResponse} from 'next'
import Cors from 'cors'
import runMiddleware from "@/utils/runMiddleware"
import moment from "moment/moment";
import 'moment/locale/id';
import {KirimUtama, Pesan} from "@/utils/telegram/chat";

moment.locale('id');

const getdata = async function (req: NextApiRequest) {

    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY');
    const pesan = await Pesan({
        pesan: `Testing Notifikasi`,
        waktu: date,
        pengirim: server,
    });
    const kirim = await KirimUtama(pesan);
    if (kirim.success) {
        return {
            status: 200,
            data: {
                success: true,
                message: "berhasil kirim pesan",
                data: kirim.data
            }
        };
    } else {
        return {
            status: 200,
            data: {
                success: false,
                message: "gagal kirim pesan",
                error: kirim.error
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