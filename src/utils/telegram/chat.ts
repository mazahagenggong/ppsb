import moment from "moment";
import { Telegraf } from 'telegraf';

type KirimPesanType = {
    bot_token: string,
    id: string,
    pesan: string,
    pengirim?: string,
    waktu: string,
}
const KirimPesan = async function (data: KirimPesanType) {
    const {bot_token, id, pesan, pengirim, waktu} = data;
    const apiUrl = `https://api.telegram.org/bot${bot_token}/sendMessage`;
    const date = moment().format('DD-MM-YYYY : HH:mm:ss');
    const garis = "-------------------------";
    let newPesan = "";
    if (pengirim) {
        newPesan = `Pesan dari : ${pengirim}\n${garis}\n`;
    } else {
        newPesan = `${pesan}\n`;
    }
    newPesan = newPesan + `${garis}\n${date}\n${garis}\n`;
    const params = {
        chat_id: id,
        pesan,
    };

    try {
        const bot = new Telegraf(bot_token);
        await bot.telegram.sendMessage(id, newPesan);
        return {
            success: true,
            data: {
                id,
                pesan,
                pengirim,
                waktu,
            }
        }
    } catch (error:any) {
        return {
            success: false,
            message: "Internal server error, koneksi ke telegram gagal",
            error:error
        }
    }
}

export default KirimPesan;