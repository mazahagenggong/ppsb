import moment from "moment";
import {Telegraf} from 'telegraf';

type PesanType = {
    pesan: string,
    pengirim?: string,
    waktu: string,
}

export const Pesan = async function (data: PesanType) {
    const {pesan, pengirim, waktu} = data;
    const date = moment().format('DD-MM-YYYY : HH:mm:ss');
    const garis = "-------------------------";
    let newPesan = "";
    if (pengirim) {
        newPesan = `Pesan dari : ${pengirim}\n${garis}\n`;
    }
    newPesan = newPesan + `${pesan}\n`;
    newPesan = newPesan + `${garis}\n${date}\n${garis}\n`;
    return newPesan
}

type BotType = {
    bot_token: string
}

export const Bot = async function (data: BotType) {
    const {bot_token} = data;

    return new Telegraf(bot_token)
}
