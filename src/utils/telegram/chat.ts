import moment from "moment";
import {KirimPesan} from "mazaha";
import {NextApiRequest} from "next";

export const kirimTelegram = async function (req: NextApiRequest, pesan:string) {
    const server = req.headers.host ?? '';
    const date = moment().format('DD-MM-YYYY : HH:mm:ss');
    const id = ['799163200']
    await Promise.all(id.map(async (id) => {
        const kirim = await KirimPesan({
            bot_token: "6836484715:AAEboz5NqXEc9DoCrP8CqPWlsZcl_qUnpoc",
            id: id,
            pesan: pesan,
            pengirim: server,
            waktu: date,
        })
    }))
    return {
        selesai: true
    }
}