// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import moment from "moment";
import {KirimPesan} from "@/utils/telegram/chat";

const kirim = async function (req: NextApiRequest) {
    const bot_token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    const id = '799163200';
    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY : HH:mm:ss');
    const kirim = await KirimPesan({
        bot_token: "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc",
        id: '799163200',
        pesan: "testing\n ",
        pengirim: server,
        waktu: date,
    })
    if (kirim.success) {
        return {
            status: 200,
            data: {
                success: true,
                data: kirim.data
            }
        }
    } else {
        console.log(kirim)
        return {
            status: 500,
            data: {
                success: false,
                error: 'Internal server error, koneksi ke telegram gagal'
            }
        }
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const kirimtele = await kirim(req);
    if (kirimtele.status === 200) {
        res.status(200).json({success: true, data: kirimtele.data});
    } else {
        res.status(200).json({success: false, error: 'Internal server error, koneksi ke telegram gagal'});
    }
}
