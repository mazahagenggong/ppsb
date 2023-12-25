// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import moment from "moment";
import {Pesan, Bot, ButtonChat} from "@/utils/telegram/chat";

const kirim = async function (req: NextApiRequest) {
    const bot_token = "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc";
    const id = '799163200';
    const server = req.headers.host ?? '';
    const url_protocol = req.headers['x-forwarded-proto'] ?? 'http';
    const date = moment().format('DD-MM-YYYY : HH:mm:ss');
    const pesan = await Pesan({
        pesan: "testing",
        pengirim: server,
        waktu: date,
    })
    const bot = await Bot({
        bot_token
    })
    const button1 = ButtonChat("Google", `${url_protocol}://${server}`);
    const cdname = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
    const imgurl = `https://res.cloudinary.com/${cdname}/psb/bukti_pembayaran/jlafoyc5v5xltuhzvxxw`;
    try {
        const kirim = await bot.telegram.sendPhoto(id, imgurl, {
            caption: pesan,
            reply_markup: {
                inline_keyboard: [
                    button1,
                ]
            }
        })
        return {
            status: 200,
            data: {
                success: true,
                data: kirim
            }
        }
    } catch (e) {
        console.log(e)
        return {
            status: 500,
            data: {
                success: false,
                error: 'Internal server error, koneksi ke telegram gagal'
            }
        }
    }
    // const kirim = await KirimPesan({
    //     bot_token: "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc",
    //     id: '799163200',
    //     pesan: "testing\n ",
    //     pengirim: server,
    //     waktu: date,
    // })
    // if (kirim.success) {
    //     return {
    //         status: 200,
    //         data: {
    //             success: true,
    //             data: kirim.data
    //         }
    //     }
    // } else {
    //     console.log(kirim)
    //     return {
    //         status: 500,
    //         data: {
    //             success: false,
    //             error: 'Internal server error, koneksi ke telegram gagal'
    //         }
    //     }
    // }
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
